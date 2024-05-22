import { Module } from '@nestjs/common';
import { CoursesProgressService } from './courses-progress.service';
import { CoursesProgressController } from './courses-progress.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {CourseProgress, CourseProgressSchema} from "./courses-progress.schema";
import {Lesson, LessonSchema} from "../lessons/lessons.shema";
import {Theme, ThemeSchema} from "../themes/themes.schema";
import {Course, CourseSchema} from "../courses/courses.schema";
import {User, UserSchema} from "../users/users.schema";
import {Homework, HomeworkSchema} from "../homeworks/homeworks.schema";
import {UsersModule} from "../users/users.module";

@Module({
  imports: [
      MongooseModule.forFeature([
        { name: CourseProgress.name, schema: CourseProgressSchema },
        { name: Lesson.name, schema: LessonSchema },
        { name: Theme.name, schema: ThemeSchema },
        { name: Course.name, schema: CourseSchema },
        { name: User.name, schema: UserSchema },
        {name: Homework.name, schema: HomeworkSchema}
      ]),
  ],
  providers: [CoursesProgressService],
  controllers: [CoursesProgressController],
    exports: [CoursesProgressService]
})
export class CoursesProgressModule {}
