import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Course} from "./courses.schema";
import {Model} from "mongoose";
import {CreateCourseDto, EnrollUserDto, UpdateCourseDto} from "./courses.dto";
import {Theme} from "../themes/themes.schema";
import {Lesson} from "../lessons/lessons.shema";
import {FilesService, FileTypes} from "../files/files.service";
import {CoursesProgressService} from "../courses-progress/courses-progress.service";
import {UsersService} from "../users/users.service";

@Injectable()
export class CoursesService {
    constructor(
       @InjectModel(Course.name) private readonly courseModel: Model<Course>,
       @InjectModel(Theme.name) private readonly themeModel: Model<Theme>,
       @InjectModel(Lesson.name) private readonly lessonModel: Model<Lesson>,
       private readonly filesService: FilesService,
       private readonly coursesProgressService: CoursesProgressService,
       private readonly usersService: UsersService
    ) {}

    async create(dto: CreateCourseDto, image): Promise<Course>{
        const imageFileName = await this.filesService.createFile(image, FileTypes.IMAGE);
        const {tags, ...rest} = dto
        const parsedTags = JSON.parse(tags);

        return await this.courseModel.create({...rest, themes: [], image: imageFileName, tags: parsedTags})
    }

    async delete(id: string){
        // Найти курс по его id
        const course = await this.courseModel.findById(id);
        if (!course) {
            throw new Error(`Course with id ${id} not found`);
        }

        // Удалить все темы, связанные с этим курсом
        await Promise.all(course.themes.map(async (themeId) => {
            const theme = await this.themeModel.findById(themeId);
            if (!theme) {
                throw new Error(`Theme with id ${themeId} not found`);
            }
            // Удалить все уроки, связанные с этой темой
            await this.lessonModel.deleteMany({ _id: { $in: theme.lessons } });
            // Удалить тему
            await this.themeModel.deleteOne({ _id: themeId });
        }));

        // Удалить курс
        await this.courseModel.deleteOne({ _id: id });
    }

    async updateCourse(id: string, dto: UpdateCourseDto): Promise<Course> {
        const course = await this.courseModel.findById(id);
        if (!course) {
            throw new Error(`Course with id ${id} not found`);
        }

        // Обновление изображения, если оно предоставлено
        if (dto.image) {
            const imageFileName = await this.filesService.createFile(dto.image, FileTypes.IMAGE);
            course.image = imageFileName;
        }

        // Обновление тегов, если они предоставлены
        if (dto.tags) {
            course.tags = JSON.parse(dto.tags);
        }

        // Обновление остальных полей
        if (dto.title) course.title = dto.title;
        if (dto.description) course.description = dto.description;

        await course.save();
        return course;
    }

    async getOne(id: string){
        return await this.courseModel.findById(id).populate({
            path: 'themes',
            populate: {
                path: 'lessons',
                model: 'Lesson'
            }
        }).exec();
    }

    async getAll(){
        return await this.courseModel.find().populate({
            path: 'themes',
            populate: {
                path: 'lessons',
                model: 'Lesson'
            }
        }).exec();
    }

    async enrollUser(dto: EnrollUserDto){
        await this.coursesProgressService.createCourseProgress(dto.userId, dto.courseId);
        return await this.usersService.enrollUserToCourse(dto.userId, dto.courseId);
    }
}
