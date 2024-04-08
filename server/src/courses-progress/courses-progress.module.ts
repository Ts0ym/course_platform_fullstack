import { Module } from '@nestjs/common';
import { CoursesProgressService } from './courses-progress.service';
import { CoursesProgressController } from './courses-progress.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {CourseProgress, CourseProgressSchema} from "./courses-progress.schema";
import {Lesson, LessonSchema} from "../lessons/lessons.shema";

@Module({
  imports: [
      MongooseModule.forFeature([
        { name: CourseProgress.name, schema: CourseProgressSchema },
        { name: Lesson.name, schema: LessonSchema }
      ])
  ],
  providers: [CoursesProgressService],
  controllers: [CoursesProgressController],
    exports: [CoursesProgressService]
})
export class CoursesProgressModule {}
