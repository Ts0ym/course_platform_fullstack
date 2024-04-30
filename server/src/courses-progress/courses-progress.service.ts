import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {CourseProgress} from "./courses-progress.schema";
import {Model, Types} from "mongoose";
import {Lesson} from "../lessons/lessons.shema";

@Injectable()
export class CoursesProgressService {
    constructor(
        @InjectModel(CourseProgress.name) private readonly coursesProgressModel: Model<CourseProgress>,
        @InjectModel(Lesson.name) private readonly lessonModel: Model<Lesson>
    ) {}

    async markLessonAsCompleted(userId: string, courseId: string, lessonId: string){
        const courseProgress = await this.coursesProgressModel.findOne({
            user: userId,
            course: courseId,
        })

        if (!courseProgress.completedLessons.includes(new Types.ObjectId(lessonId))) {
            courseProgress.completedLessons.push(new Types.ObjectId(lessonId));
            await courseProgress.save();
        }
    }

    async createCourseProgress(userId: string, courseId: string) {
        const existingProgress = await this.coursesProgressModel.findOne({
            user: userId,
            course: courseId,
        });

        if (existingProgress) {
            throw new Error('Course progress for this user and course already exists.');
        }

        const courseProgress = new this.coursesProgressModel({
            user: userId,
            course: courseId,
            completedLessons: [],
        });

        await courseProgress.save();
        return courseProgress;
    }

    async getCourseProgress(dto: {courseId: string, userId: string}) {
        const courseProgress = await this.coursesProgressModel.findOne({
            user: new Types.ObjectId(dto.userId),
            course: new Types.ObjectId(dto.courseId),
        });

        if (!courseProgress) {
            throw new Error('Course progress for this user and course does not exist.');
        }

        return courseProgress;
    }
}

