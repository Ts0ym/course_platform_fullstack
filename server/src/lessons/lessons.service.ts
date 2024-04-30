import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Course} from "../courses/courses.schema";
import {Model, Types} from "mongoose";
import {Theme} from "../themes/themes.schema";
import {Lesson} from "./lessons.shema";
import {CreateLessonDto} from "./lessons.dto";
import {FilesService, FileTypes} from "../files/files.service";
import {CourseProgress} from "../courses-progress/courses-progress.schema";
import {Homework} from "../homeworks/homeworks.schema";
import {CoursesProgressService} from "../courses-progress/courses-progress.service";
import {TestResult} from "../test-result/test-result.schema";

@Injectable()
export class LessonsService {
    constructor(
        @InjectModel(Theme.name) private readonly themeModel: Model<Theme>,
        @InjectModel(Lesson.name) private readonly lessonModel: Model<Lesson>,
        @InjectModel(CourseProgress.name) private readonly coursesProgressModel: Model<CourseProgress>,
        @InjectModel(Course.name) private readonly courseModel: Model<Course>,
        @InjectModel(Homework.name) private readonly homeworkModel: Model<Homework>,
        @InjectModel(TestResult.name) private readonly testResultModel: Model<TestResult>,
        private readonly filesService: FilesService,

    ) {}

    async createVideo(dto: CreateLessonDto, videoFile){
        const videoFileImage = await this.filesService.createFile(videoFile, FileTypes.VIDEO)
        const {themeId, ...rest } = dto
        const theme = await this.themeModel.findById(themeId)
        const lesson = await this.lessonModel.create({...rest, videoUrl: videoFileImage})
        theme.lessons.push(lesson._id)
        theme.save()
        return lesson
    }

    async create(dto: CreateLessonDto){
        const {themeId, ...rest } = dto
        if(rest.questions) rest.questions = JSON.parse(rest.questions)
        const theme = await this.themeModel.findById(themeId)
        const lesson = await this.lessonModel.create({...rest, themeId: theme._id})
        theme.lessons.push(lesson._id)
        theme.save()
        return lesson
    }

    async delete(lessonId: string): Promise<{ deleted: boolean; message: string }> {
        const lesson = await this.lessonModel.findById(lessonId);
        if (!lesson) {
            return { deleted: false, message: "Lesson not found" };
        }

        // Удаление урока из темы
        await this.themeModel.updateMany(
            { lessons: lesson._id },
            { $pull: { lessons: lesson._id } }
        );

        // Удаление урока из прогресса курса
        await this.coursesProgressModel.updateMany(
            { completedLessons: lesson._id },
            { $pull: { completedLessons: lesson._id } }
        );

        const deleteHomeworksResult = await this.homeworkModel.deleteMany({ lessonId });
        if (deleteHomeworksResult.deletedCount === 0) {
            console.log("No homeworks were deleted.");
        } else {
            console.log(`Deleted ${deleteHomeworksResult.deletedCount} homework(s).`);
        }

        // Удаление результатов теста, если урок имел тип 'quiz'
        if (lesson.type === 'quiz') {
            await this.testResultModel.deleteMany({ lessonId: lesson._id });
        }

        // Наконец, удаление самого урока
        const deleteResult = await this.lessonModel.deleteOne({ _id: lesson._id });
        if (deleteResult.deletedCount === 0) {
            return { deleted: false, message: "Failed to delete the lesson" };
        }

        return { deleted: true, message: "Lesson and all related data deleted successfully" };
    }

    async getOne(id: string){
        return await this.lessonModel.findById(id).exec()
    }

    async getAll(){
        return await this.lessonModel.find().exec()
    }

    async getLessonByUser(userId: string, lessonId: string) {
        // Находим урок по ID
        const lesson = await this.lessonModel.findById(lessonId);
        if (!lesson) {
            throw new Error('Lesson not found');
        }

        // Находим тему, к которой принадлежит урок
        const theme = await this.themeModel.findOne({ lessons: lesson._id }).populate("lessons");
        if (!theme) {
            throw new Error('Theme for this lesson not found');
        }

        // Находим курс, к которому принадлежит тема
        const course = await this.courseModel.findOne({ themes: theme._id });
        if (!course) {
            throw new Error('Course for this theme not found');
        }

        // Находим прогресс курса пользователя
        const progress = await this.coursesProgressModel.findOne({
            user: new Types.ObjectId(userId),
            course: course._id,
        });

        const homeworks = await this.homeworkModel.find({
            lessonId: lessonId,
            userId: userId
        }).populate({path: "userId", select: "_id email name surname avatar"})

        // Проверяем, выполнен ли урок
        const isCompleted = progress?.completedLessons.some(id => id.equals(lesson._id)) || false;

        return {
            lesson: {...lesson.toObject(),
            course: {...course.toObject()},
            theme: {...theme.toObject()}},
            isCompleted,
            homeworks,
            completedLessons: progress?.completedLessons};
    }

}
