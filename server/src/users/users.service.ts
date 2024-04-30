import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "./users.schema";
import {Model, Types} from "mongoose";
import {CreateUserDto, UpdateUserDto} from "./users.dto";
const bcrypt = require('bcryptjs');
import { v4 as uuidv4 } from 'uuid';
import {CoursesProgressService} from "../courses-progress/courses-progress.service";
import {Course} from "../courses/courses.schema";
import {Lesson} from "../lessons/lessons.shema";
import {Theme} from "../themes/themes.schema";
import {FilesService, FileTypes} from "../files/files.service";




@Injectable()
export class UsersService {
    constructor(
       @InjectModel(User.name) private readonly usersModel: Model<User>,
       @InjectModel(Course.name) private readonly courseModel: Model<Course>,
       private coursesProgressService: CoursesProgressService,
       private readonly filesService: FilesService,
    ) {}

    async findOne(email: string){
        return this.usersModel.findOne({email: email}).exec()
    }

    async findById(id: string){
        try {
            return this.usersModel.findById(id).select("-password -resetPasswordToken -refreshToken -activationToken -lastVisitedLesson -coursesEnrolled").exec()
        }catch (e) {
            throw new Error(`Error finding user with id ${id} ${e.message}`)
        }
    }

    async createUser(dto: CreateUserDto){
        const activationToken = uuidv4()
        const newUser: User = {
            ...dto,
            role: "user",
            balance: 0,
            password: await this.hashData(dto.password),
            refreshToken: null,
            isActivated: false,
            activationToken,
            resetPasswordToken: null,
            coursesEnrolled: [],
            lastVisitedLesson: null,
            avatar: "avatar-placeholder.jpg",
            aboutMe: null,
            socialLinks: null
        }
        return (await this.usersModel.create(newUser)).toJSON()
    }

    async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
        const user = await this.usersModel.findById(id);
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }

        // Проверка и удаление старого аватара, если он не является плейсхолдером
        if (dto.avatar) {
            const defaultAvatar = "avatar_placeholder.jpg";
            if (user.avatar && user.avatar !== defaultAvatar) {
                try {
                    await this.filesService.deleteFile(user.avatar, FileTypes.IMAGE);
                } catch (error) {
                    throw new Error(`Failed to delete old avatar: ${error.message}`);
                }
            }

            const avatarFileName = await this.filesService.createFile(dto.avatar, FileTypes.IMAGE);
            user.avatar = avatarFileName;
        }

        // Обновление информации о пользователе
        if (dto.aboutMe !== undefined) user.aboutMe = dto.aboutMe;
        if (dto.socialLinks !== undefined) user.socialLinks = JSON.parse(dto.socialLinks);
        if (dto.name !== undefined) user.name = dto.name;
        if (dto.surname !== undefined) user.surname = dto.surname;

        await user.save();
        return user;
    }


    async hashData(data: string){
        return await bcrypt.hash(data, 4)
    }

    async updateRefreshToken(id: string, refreshToken: string){
        await this.usersModel.findByIdAndUpdate(id, {refreshToken: refreshToken})
    }

    async deleteRefreshToken(email: string){
        await this.usersModel.findOneAndUpdate({email: email}, {refreshToken: null})
    }

    async findUserWithActivationToken(activationToken: string){
        return await this.usersModel.findOne({activationToken: activationToken}).exec()
    }

    async findUserWithResetPasswordToken(resetPasswordToken: string){
        return await this.usersModel.findOne({resetPasswordToken: resetPasswordToken}).exec()
    }

    async getAll(){
        return await this.usersModel.find().exec()
    }

    async enrollUserToCourse(userId: string, courseId: string){
        const user = await this.usersModel.findById(userId).exec()
        if (user && user.coursesEnrolled.includes(new Types.ObjectId(courseId))) {
            throw new Error('User is already enrolled in this course');
        }
        return await this.usersModel.findByIdAndUpdate(userId, {$push: {coursesEnrolled: new Types.ObjectId(courseId)}})
    }

    async getLastLesson(userId: string){
        const user = await this.usersModel.findById(userId)
            .populate({path: 'lastVisitedLesson', populate: {
                path: 'themeId', model: 'Theme', populate: {
                    path: 'courseId', model: 'Course', populate: {
                        path: "themes", model: "Theme"
                        }
                    }
                }})
            .exec()
        if (!user) {
            throw new Error('User not found');
        }

        const lesson = user.lastVisitedLesson as Lesson;
        const theme = lesson.themeId as Theme


        const lastCourseProgress =
            await this.coursesProgressService.getCourseProgress({
                courseId: theme.courseId._id.toString(),
                userId: user._id.toString()
            })

        if(!lastCourseProgress){
            throw new Error('Last course not found');
        }

        return {
            course: theme.courseId,
            progress: lastCourseProgress,
            lesson: user.lastVisitedLesson
        }
    }

    async setLastCourse(dto: {courseId: string, userId: string}){
        return this.usersModel.findByIdAndUpdate(dto.userId, {$set: {lastVisitedCourse: new Types.ObjectId(dto.courseId)}})
    }

    async getUserCourses(userId: string){
        const user=  await this.usersModel.findById(userId)
            .populate({
                path: 'coursesEnrolled',
                model: "Course",
                populate: {
                    path: 'themes',
                    model: 'Theme'}})
            .exec()
        return user.coursesEnrolled
    }

    async getRecommendedCourses(userId: string) {
        // Получаем курсы, на которые уже записан пользователь
        const user = await this.usersModel.findById(userId)
            .populate({
                path: 'coursesEnrolled',
                model: "Course"
            })
            .exec();

        if (!user) {
            throw new Error('User not found');
        }

        // Получаем список ID курсов, на которые записан пользователь
        const enrolledCourseIds = user.coursesEnrolled.map(course => course._id.toString());

        // Получаем все доступные курсы
        const allCourses = await this.courseModel.find()
            .populate({
                path: 'themes',
                populate: {
                    path: 'lessons',
                    model: 'Lesson' // Модель урока
                }
            })
            .exec();

        // Фильтруем курсы, исключая те, на которые пользователь уже записан
        const recommendedCourses = allCourses.filter(course => !enrolledCourseIds.includes(course._id.toString()));

        // Выбираем до трех рекомендуемых курсов для возвращения
        const maxRecommendedCourses = 3;
        return recommendedCourses.slice(0, maxRecommendedCourses);
    }

    async setLastLesson(dto: {lessonId: string, userId: string}){
        const user = await this.usersModel.findById(dto.userId).exec()
        user.lastVisitedLesson = new Types.ObjectId(dto.lessonId)
        await user.save()
        return user
    }


}
