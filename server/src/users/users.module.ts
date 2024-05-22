import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./users.schema";
import {JwtModule} from "@nestjs/jwt";
import {CoursesProgressService} from "../courses-progress/courses-progress.service";
import {CourseProgress, CourseProgressSchema} from "../courses-progress/courses-progress.schema";
import {CoursesService} from "../courses/courses.service";
import {Course, CourseSchema} from "../courses/courses.schema";
import {Lesson, LessonSchema} from "../lessons/lessons.shema";
import {FilesService} from "../files/files.service";
import {Tariff, TariffSchema} from "../tariff/tariff.schema";
import {Homework, HomeworkSchema} from "../homeworks/homeworks.schema";
import {Achievement, AchievementSchema} from "../achievements/achievements.schema";
import {Theme, ThemeSchema} from "../themes/themes.schema";

@Module({
  imports: [MongooseModule.forFeature([
    {name: User.name, schema: UserSchema},
    {name: CourseProgress.name, schema: CourseProgressSchema},
    {name: Course.name, schema: CourseSchema },
    {name: Lesson.name, schema: LessonSchema},
    {name: Tariff.name, schema: TariffSchema},
    {name: Homework.name, schema: HomeworkSchema},
    {name: Achievement.name, schema: AchievementSchema},
    {name: Theme.name, schema: ThemeSchema}
  ]), JwtModule.register({})],
  providers: [UsersService, CoursesProgressService, FilesService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
