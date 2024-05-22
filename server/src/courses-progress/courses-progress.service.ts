import {BadRequestException, forwardRef, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {CourseProgress} from "./courses-progress.schema";
import {Model, Types} from "mongoose";
import {Lesson} from "../lessons/lessons.shema";
import {Course} from "../courses/courses.schema";
import {UsersService} from "../users/users.service";
import {User} from "../users/users.schema";

@Injectable()
export class CoursesProgressService {
    constructor(
        @InjectModel(CourseProgress.name) private readonly coursesProgressModel: Model<CourseProgress>,
        @InjectModel(Course.name) private readonly courseModel: Model<Course>,
        @InjectModel(User.name) private readonly usersModel: Model<User>,
        @InjectModel(Lesson.name) private readonly lessonModel: Model<Lesson>,
        // @InjectModel(Lesson.name) private readonly lessonModel: Model<Lesson>
    ) {}

    async markLessonAsCompleted(userId: string, courseId: string, lessonId: string){
        const courseProgress = await this.coursesProgressModel.findOne({
            user: userId,
            course: courseId,
        })

        const lesson = await this.lessonModel.findById(lessonId);
        if (lesson.reward <= 0) {
            throw new BadRequestException('Amount must be greater than zero');
        }
        const user = await this.usersModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        user.balance += lesson.reward;
        await user.save()

        if (!courseProgress.completedLessons.includes(new Types.ObjectId(lessonId))) {
            courseProgress.completedLessons.push(new Types.ObjectId(lessonId));
            await courseProgress.save();
        }
    }

    async createCourseProgress(userId: string, courseId: string, tariffId: string, startDate: Date) {
        const existingProgress = await this.coursesProgressModel.findOne({
            user: userId,
            course: courseId
        });

        if (existingProgress) {
            throw new Error('Course progress for this user and course already exists.');
        }

        const courseProgress = new this.coursesProgressModel({
            user: userId,
            course: courseId,
            tariff: tariffId,
            startDate: startDate,
            completedLessons: []
        });

        await courseProgress.save();
        return courseProgress;
    }

    async getCourseProgress(dto: {courseId: string, userId: string}) {
        const courseProgress = await this.coursesProgressModel.findOne({
            user: new Types.ObjectId(dto.userId),
            course: new Types.ObjectId(dto.courseId),
        }).populate('tariff');

        if (!courseProgress) {
            throw new Error('Course progress for this user and course does not exist.');
        }

        return courseProgress;
    }

    async getCoursePercentage(dto: { courseId: string, userId: string }) {
        const courseProgress = await this.coursesProgressModel.findOne({
            user: new Types.ObjectId(dto.userId),
            course: new Types.ObjectId(dto.courseId),
        }).populate({path: 'completedLessons'});

        if (!courseProgress) {
            throw new Error('Course progress for this user and course does not exist.');
        }

        const course = await this.courseModel.findById(dto.courseId).populate({
            path: 'themes',
            model: 'Theme',
            populate: {
                path: 'lessons',
                model: 'Lesson'
            }
        });

        if (!course) {
            throw new Error('Course not found.');
        }

        const allLessons = course.themes.reduce((acc, theme: any) => acc.concat(theme.lessons), []);
        const completedLessons = courseProgress.completedLessons.map(lesson => lesson._id.toString());
        const completionPercentage = (completedLessons.length / allLessons.length) * 100;

        return completionPercentage

    }
}

