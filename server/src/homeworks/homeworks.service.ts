import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Theme} from "../themes/themes.schema";
import {Model} from "mongoose";
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
        const createdHomework = new this.homeworkModel({...dto, grade: 0, isRated: false});
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
        return this.homeworkModel.find({isRated: false})
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

    async rateHomework(dto: RateHomeworkDto){
        try{
            const homework = await this.homeworkModel.findById(dto.homeworkId);
            homework.grade = dto.grade
            homework.assessment = dto.assessment
            homework.isRated = true
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
}
