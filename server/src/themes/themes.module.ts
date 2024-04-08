import { Module } from '@nestjs/common';
import { ThemesController } from './themes.controller';
import { ThemesService } from './themes.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Course, CourseSchema} from "../courses/courses.schema";
import {Theme, ThemeSchema} from "./themes.schema";
import {Lesson, LessonSchema} from "../lessons/lessons.shema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: Theme.name, schema: ThemeSchema },
      { name: Lesson.name, schema: LessonSchema }
    ])
  ],
  controllers: [ThemesController],
  providers: [ThemesService]
})
export class ThemesModule {}