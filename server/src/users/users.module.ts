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

@Module({
  imports: [MongooseModule.forFeature([
    {name: User.name, schema: UserSchema},
    {name: CourseProgress.name, schema: CourseProgressSchema},
    {name: Course.name, schema: CourseSchema },
    {name: Lesson.name, schema: LessonSchema},
  ]), JwtModule.register({})],
  providers: [UsersService, CoursesProgressService, FilesService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
