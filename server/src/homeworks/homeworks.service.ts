import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Theme} from "../themes/themes.schema";
import {Model, Types} from "mongoose";
import {Lesson} from "../lessons/lessons.shema";
import {CourseProgress} from "../courses-progress/courses-progress.schema";
import {Course} from "../courses/courses.schema";
import {Homework} from "./homeworks.schema";
import {FilesService} from "../files/files.service";
import {CreateHomeworkDto, RateHomeworkDto, UpdateHomeworkDto} from "./homeworks.dto";
import {
    COURSES_COLLECTION_NAME,
    LESSONS_COLLECTION_NAME,
    THEMES_COLLECTION_NAME,
    USERS_COLLECTION_NAME
} from "../constants";
import {CoursesProgressService} from "../courses-progress/courses-progress.service";

@Injectable()
export class HomeworksService {
    constructor(
        @InjectModel(Homework.name) private readonly homeworkModel: Model<Homework>,
        @InjectModel(Lesson.name) private readonly lessonModel: Model<Lesson>,
        private readonly coursesProgressService: CoursesProgressService
    ) {}

    async create(dto: CreateHomeworkDto): Promise<Homework> {
        const createdHomework = new this.homeworkModel({
            ...dto,
            grade: 0,
            isRated: false,
            status: 'submitted',
            previousVersion: dto.previousVersion || null // Опциональная ссылка на предыдущую версию
        });
        return createdHomework.save();
    }

    async updateHomework(homeworkId: string, dto: UpdateHomeworkDto): Promise<Homework> {
        const updatedHomework = await this.homeworkModel.findByIdAndUpdate(homeworkId, dto, { new: true });
        if (!updatedHomework) {
            throw new NotFoundException('Homework not found');
        }
        return updatedHomework;
    }

    async deleteHomework(homeworkId: string): Promise<{ deleted: boolean, message?: string }> {
        const result = await this.homeworkModel.findByIdAndDelete(homeworkId);
        if (result) {
            return { deleted: true };
        } else {
            return { deleted: false, message: "Homework not found" };
        }
    }

    async getAllUnratedHomeworks(){
        return this.homeworkModel.find({status: 'submitted'})
            .populate({
                path: "userId",
                model: "User",
                select: "name surname email avatar"
            })
            .populate({
                path: "lessonId",
                model: "Lesson",
                select: "title homeworkText",
                populate: {
                    path: "themeId",
                    model: "Theme",
                    select: "title",
                    populate: {
                        path: "courseId",
                        model: "Course",
                        select: "title"
                    }}});
    }

    async getAllCheckedHomeworks(){
        return this.homeworkModel.find({ status: { $ne: 'submitted' } })
            .populate({
                path: "userId",
                model: "User",
                select: "name surname email avatar"
            })
            .populate({
                path: "lessonId",
                model: "Lesson",
                select: "title homeworkText",
                populate: {
                    path: "themeId",
                    model: "Theme",
                    select: "title",
                    populate: {
                        path: "courseId",
                        model: "Course",
                        select: "title"
                    }}});
    }

    async getHomeworkById(homeworkId: string){
        try {
            return this.homeworkModel.findById(homeworkId)
                .populate({
                    path: "userId",
                    model: "User",
                    select: "name surname email avatar"
                })
                .populate({
                    path: "lessonId",
                    model: "Lesson",
                    select: "title homeworkText",
                    populate: {
                        path: "themeId",
                        model: "Theme",
                        select: "title",
                        populate: {
                            path: "courseId",
                            model: "Course",
                            select: "title"
                        }}});
        }catch (e) {
            return e
        }
    }

    async getHomeworkHistory(lessonId: string, userId: string, homeworkId: string): Promise<Homework[]> {
        let history = [];
        let findedHomework = await this.homeworkModel.findById(homeworkId).exec();

        // Проверяем, была ли найдена домашняя работа
        if (!findedHomework) {
            throw new Error('Homework not found.');
        }
        // // Добавляем найденную домашнюю работу в историю как начальную точку
        // history.push(findedHomework);

        // Начинаем с предыдущей версии, если она существует
        let current = findedHomework.previousVersion ?
            await this.homeworkModel.findById(findedHomework.previousVersion).populate({
                path: "userId",
                model: "User",
            }).exec() : null;

        while (current) {
            history.push(current);
            if (!current.previousVersion) break;
            current = await this.homeworkModel.findById(current.previousVersion).populate({
                path: "userId",
                model: "User",
            }).exec();
        }

        return history;
    }

    async rateHomework(dto: RateHomeworkDto){
        try{
            const homework = await this.homeworkModel.findById(dto.homeworkId);
            homework.assessment = dto.assessment
            homework.status = "graded"
            homework.grade = dto.grade
            homework.save()

            const userId = homework.userId
            const lessonId = homework.lessonId

            const lesson = await this.lessonModel.findById(lessonId).populate({
                path: "themeId",
                    model: "Theme",
                    populate: {
                    path: "courseId",
                        model: "Course",
                        select: "title _id"
                }})

            const courseId = lesson.themeId.courseId._id
            await this.coursesProgressService.markLessonAsCompleted(userId.toString(), courseId.toString(), lessonId.toString())
        }catch (e) {
            throw new Error('Failed to rate homework');
        }
    }

    async requestRevision(homeworkId: string, comments: string): Promise<Homework> {
        const homework = await this.homeworkModel.findById(homeworkId);
        if (!homework) {
            throw new NotFoundException('Homework not found');
        }
        homework.status = 'returned';
        homework.assessment = comments; // Сохранение комментариев для доработки
        return homework.save();
    }
}
