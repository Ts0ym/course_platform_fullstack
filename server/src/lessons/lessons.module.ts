import { Module } from '@nestjs/common';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import {Theme, ThemeSchema} from "../themes/themes.schema";
import {Lesson, LessonSchema} from "./lessons.shema";
import {MongooseModule} from "@nestjs/mongoose";
import {FilesService} from "../files/files.service";
import {CoursesProgressService} from "../courses-progress/courses-progress.service";
import {CourseProgress, CourseProgressSchema} from "../courses-progress/courses-progress.schema";
import {Course, CourseSchema} from "../courses/courses.schema";
import {Homework, HomeworkSchema} from "../homeworks/homeworks.schema";
import {User, UserSchema} from "../users/users.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: Theme.name, schema: ThemeSchema },
        { name: Lesson.name, schema: LessonSchema },
        { name: CourseProgress.name, schema: CourseProgressSchema },
        { name: Course.name, schema: CourseSchema },
        { name: Homework.name, schema: HomeworkSchema },
        { name: User.name, schema: UserSchema}
    ])
  ],
  controllers: [LessonsController],
  providers: [
      LessonsService,
      FilesService,
      CoursesProgressService
  ],
    exports: [
        LessonsService,
    ]
})
export class LessonsModule {}
