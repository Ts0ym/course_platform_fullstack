import { Module } from '@nestjs/common';
import { HomeworksService } from './homeworks.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Lesson, LessonSchema} from "../lessons/lessons.shema";
import {Homework, HomeworkSchema} from "./homeworks.schema";
import {User, UserSchema} from "../users/users.schema";
import { HomeworksController } from './homeworks.controller';
import {CoursesProgressService} from "../courses-progress/courses-progress.service";
import {CoursesProgressModule} from "../courses-progress/courses-progress.module";
import {CourseProgress, CourseProgressSchema} from "../courses-progress/courses-progress.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lesson.name, schema: LessonSchema },
      { name: Homework.name, schema: HomeworkSchema },
      { name: User.name, schema: UserSchema },
      { name: CourseProgress.name, schema: CourseProgressSchema}
    ])
  ],
  providers: [HomeworksService, CoursesProgressService],
  controllers: [HomeworksController]
})
export class HomeworksModule {}
