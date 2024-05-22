import {BadRequestException, forwardRef, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "./users.schema";
import {Model, Types} from "mongoose";
import {CreateUserDto, UpdateUserDto} from "./users.dto";
const bcrypt = require('bcryptjs');
import { v4 as uuidv4 } from 'uuid';
import {CoursesProgressService} from "../courses-progress/courses-progress.service";
import {Course, CourseDocument} from "../courses/courses.schema";
import {Lesson, LessonDocument} from "../lessons/lessons.shema";
import {Theme, ThemeDocument} from "../themes/themes.schema";
import {FilesService, FileTypes} from "../files/files.service";
import {Tariff} from "../tariff/tariff.schema";
import {Achievement, AchievementDocument} from "../achievements/achievements.schema";
import {CourseProgress, CourseProgressDocument} from "../courses-progress/courses-progress.schema";
import {Homework} from "../homeworks/homeworks.schema";




@Injectable()
export class UsersService {
    constructor(
       @InjectModel(User.name) private readonly usersModel: Model<User>,
       @InjectModel(Course.name) private readonly courseModel: Model<Course>,
       @InjectModel(Tariff.name) private readonly tariffModel: Model<Tariff>,
       @InjectModel(Achievement.name) private readonly achievementModel: Model<Achievement>,
       @InjectModel(Lesson.name) private readonly lessonModel: Model<Lesson>,
       @InjectModel(Theme.name) private readonly themeModel: Model<Theme>,
       @InjectModel(CourseProgress.name) private readonly courseProgressModel: Model<CourseProgressDocument>,
       @InjectModel(Homework.name) private readonly homeworkModel: Model<Homework>,
       @Inject(forwardRef(() => CoursesProgressService)) private readonly coursesProgressService: CoursesProgressService,
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

    async getFullUserData(id: string){
        try {
            const userData = await this.usersModel.findById(id).populate({
                path: "coursesEnrolled",
                model: "Course"
            }).exec();

            if (!userData) {
                throw new Error(`User with id ${id} not found`);
            }
            const courses = userData.coursesEnrolled;
            const coursesWithProgress = [];

            for (let i = 0; i < courses.length; i++) {
                const course = courses[i];
                const progress = await this.coursesProgressService.getCourseProgress({courseId: course._id.toString(), userId:id});
                const progressPercentage = await this.coursesProgressService.getCoursePercentage({ courseId: course._id.toString(), userId: id }) || 0;
                coursesWithProgress.push({ course, progress: progressPercentage, startDate: progress.startDate, tariff: progress.tariff});
            }

            const { coursesEnrolled, ...rest} = userData.toObject()

            return { ...rest, coursesWithProgress };
        } catch (e) {
            throw new Error(`Error finding user with id ${id}: ${e.message}`);
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
            avatar: "avatar_placeholder.jpg",
            aboutMe: null,
            socialLinks: null,
            consultationTokens: 0,
            achievements: [],
        }
        return (await this.usersModel.create(newUser)).toJSON()
    }

    async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
        const user = await this.usersModel.findById(id);
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }

        try{
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
        }catch (e) {

        }
        // Обновление информации о пользователе
        if (dto.aboutMe !== undefined) user.aboutMe = dto.aboutMe;
        if (dto.socialLinks !== undefined) user.socialLinks = dto.socialLinks.split(',');
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
        return await this.usersModel.find().select({ name: 1, email: 1, surname: 1, role: 1}).exec()
    }

    async enrollUserToCourse(userId: string, courseId: string, tariffId: string){
        const user = await this.usersModel.findById(userId).exec();
        if (!user) {
            throw new Error('User not found');
        }
        if (user.coursesEnrolled.includes(new Types.ObjectId(courseId))) {
            throw new Error('User is already enrolled in this course');
        }

        user.coursesEnrolled.push(new Types.ObjectId(courseId));

        const tariff = await this.tariffModel.findById(tariffId).exec() as Tariff
        if (!tariff) {
            throw new Error('Tariff not found');
        }
        user.consultationTokens += tariff.freeConsultations;
        await user.save();
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

    async getRecommendedCourses(userId: string, tags?: string[], search?: string): Promise<Course[]> {
        const user = await this.usersModel.findById(userId)
            .populate({
                path: 'coursesEnrolled',
                model: "Course"
            })
            .exec();

        if (!user) {
            throw new Error('User not found');
        }

        const enrolledCourseIds = user.coursesEnrolled.map(course => course._id.toString());

        const query: any = {
            _id: { $nin: enrolledCourseIds },
        };

        if (tags && tags.length > 0) {
            query.tags = { $in: tags };
        }

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const recommendedCourses = await this.courseModel.find(query)
            .populate({
                path: 'themes',
                populate: {
                    path: 'lessons',
                    model: 'Lesson',
                },
            })
            .exec();

        return recommendedCourses;
    }

    async setLastLesson(dto: {lessonId: string, userId: string}){
        const user = await this.usersModel.findById(dto.userId).exec()
        user.lastVisitedLesson = new Types.ObjectId(dto.lessonId)
        await user.save()
        return user
    }

    async addBalance(userId: string, amount: number): Promise<User> {
        if (amount <= 0) {
            throw new BadRequestException('Amount must be greater than zero');
        }

        const user = await this.usersModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.balance += amount;
        return user.save();
    }

    async subtractBalance(userId: string, amount: number): Promise<User> {
        if (amount <= 0) {
            throw new BadRequestException('Amount must be greater than zero');
        }

        const user = await this.usersModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.balance < amount) {
            throw new BadRequestException('Insufficient balance');
        }

        user.balance -= amount;
        return user.save();
    }

    async addConsultationTokens(userId: string, amount: number): Promise<User> {
        if (amount <= 0) {
            throw new BadRequestException('Amount must be greater than zero');
        }

        const user = await this.usersModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.consultationTokens += amount;
        return user.save();
    }

    async subtractConsultationTokens(userId: string, amount: number): Promise<User> {
        if (amount <= 0) {
            throw new BadRequestException('Amount must be greater than zero');
        }

        const user = await this.usersModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.consultationTokens < amount) {
            throw new BadRequestException('Insufficient balance');
        }

        user.consultationTokens -= amount;
        return user.save();
    }

    async checkAchievements(userId: string): Promise<Achievement[]> {
        const user = await this.usersModel.findById(userId).populate('coursesEnrolled');
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const courseProgressList = await this.courseProgressModel.find({ user: userId }).populate('completedLessons').exec();

        const achievements = await this.achievementModel.find().exec();
        const newlyCompletedAchievements: Achievement[] = [];

        for (const achievement of achievements) {
            let achievementCompleted = false;

            switch (achievement.condition) {
                case 'complete_first_lesson':
                    if (courseProgressList.some(cp => cp.completedLessons.length >= 1)) {
                        achievementCompleted = true;
                    }
                    break;
                case 'complete_5_lessons':
                    if (courseProgressList.some(cp => cp.completedLessons.length >= 5)) {
                        achievementCompleted = true;
                    }
                    break;
                case 'complete_10_lessons':
                    if (courseProgressList.some(cp => cp.completedLessons.length >= 10)) {
                        achievementCompleted = true;
                    }
                    break;
                case 'complete_first_theme':
                    for (const progress of courseProgressList) {
                        const course = await this.courseModel.findById(progress.course).populate<{
                            themes: (ThemeDocument & { lessons: LessonDocument[] })[]
                        }>({
                            path: 'themes',
                            populate: {
                                path: 'lessons',
                                model: 'Lesson',
                            },
                        }).exec();

                        if (course.themes.some(theme => theme.lessons.every(lesson => progress.completedLessons.includes(lesson._id)))) {
                            achievementCompleted = true;
                        }
                    }
                    break;
                case 'complete_3_themes':
                    let completedThemesCount = 0;
                    for (const progress of courseProgressList) {
                        const course = await this.courseModel.findById(progress.course).populate<{
                            themes: (ThemeDocument & { lessons: LessonDocument[] })[]
                        }>({
                            path: 'themes',
                            populate: {
                                path: 'lessons',
                                model: 'Lesson',
                            },
                        }).exec();

                        completedThemesCount += course.themes.filter(theme => theme.lessons.every(lesson => progress.completedLessons.includes(lesson._id))).length;
                    }
                    if (completedThemesCount >= 3) {
                        achievementCompleted = true;
                    }
                    break;
                case 'submit_first_homework':
                    const homeworks = await this.homeworkModel.find({ userId }).exec();
                    if (homeworks.length >= 1) {
                        achievementCompleted = true;
                    }
                    break;
                case 'submit_5_homeworks':
                    const homeworks5 = await this.homeworkModel.find({ userId }).exec();
                    if (homeworks5.length >= 5) {
                        achievementCompleted = true;
                    }
                    break;
                // case 'complete_lesson_in_a_week':
                //     const lastWeek = new Date();
                //     lastWeek.setDate(lastWeek.getDate() - 7);
                //     if (courseProgressList.some(cp => cp.completedLessons.some(lesson => lesson.completionDate >= lastWeek))) {
                //         achievementCompleted = true;
                //     }
                //     break;
                // case 'participate_in_3_consultations':
                //     if (user.consultations.length >= 3) {
                //         achievementCompleted = true;
                //     }
                //     break;
                case 'complete_course':
                    if (await this.isCourseCompleted(userId)) {
                        achievementCompleted = true;
                    }
                    break;
                default:
                    break;
            }

            if (achievementCompleted && !user.achievements.includes(achievement._id)) {
                await this.addAchievement(user._id, achievement._id);
                newlyCompletedAchievements.push(achievement);
            }
        }

        return newlyCompletedAchievements;
    }

    private async isCourseCompleted(userId: string): Promise<boolean> {
        const courseProgressList = await this.courseProgressModel.find({ user: userId })
            .populate({
                path: 'course',
                model: 'Course',
                populate: {
                    path: 'themes',
                    model: 'Theme',
                    populate: {
                        path: 'lessons',
                        model: 'Lesson',
                    },
                },
            }).exec();

        return courseProgressList.some(courseProgress => {
            const course = courseProgress.course as unknown as CourseDocument & {
                themes: (ThemeDocument & { lessons: LessonDocument[] })[]
            };
            return course.themes.every((theme: Theme) => {
                const lessons = theme.lessons;
                return lessons.every(lesson => courseProgress.completedLessons.includes(lesson._id));
            });
        });
    }

    private async addAchievement(userId: Types.ObjectId, achievementId: Types.ObjectId): Promise<void> {
        const user = await this.usersModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!user.achievements.includes(achievementId)) {
            user.achievements.push(achievementId);
            await user.save();
        }
    }

    async getUserAchievements(userId: string) {
        const user = await this.usersModel.findById(userId).populate('achievements');
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const allAchievements = await this.achievementModel.find().exec();
        const userAchievements = user.achievements.map(a => a.toString());

        const achievements = allAchievements.map(achievement => ({
            _id: achievement._id.toString(),
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
            condition: achievement.condition,
            achieved: userAchievements.includes(achievement._id.toString())
        }));

        return achievements;
    }
}
