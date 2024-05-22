import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Course, CourseSchema} from "./courses.schema";
import {Theme, ThemeSchema} from "../themes/themes.schema";
import {Lesson, LessonSchema} from "../lessons/lessons.shema";
import {FilesService} from "../files/files.service";
import {CoursesProgressService} from "../courses-progress/courses-progress.service";
import {UsersService} from "../users/users.service";
import {CoursesProgressModule} from "../courses-progress/courses-progress.module";
import {User, UserSchema} from "../users/users.schema";
import {CourseProgress, CourseProgressSchema} from "../courses-progress/courses-progress.schema";
import {Homework, HomeworkSchema} from "../homeworks/homeworks.schema";
import {Tariff, TariffSchema} from "../tariff/tariff.schema";
import {Achievement, AchievementSchema} from "../achievements/achievements.schema";

@Module({
  imports: [
      MongooseModule.forFeature([
        { name: Course.name, schema: CourseSchema },
          { name: Theme.name, schema: ThemeSchema },
          { name: Lesson.name, schema: LessonSchema },
          { name: User.name, schema: UserSchema},
          {name: CourseProgress.name, schema: CourseProgressSchema},
          {name: Homework.name, schema: HomeworkSchema},
          {name: Tariff.name, schema: TariffSchema},
          {name: Achievement.name, schema: AchievementSchema}
      ]),
  ],
  providers: [
      CoursesService,
      FilesService,
      CoursesProgressService,
      UsersService],
  controllers: [CoursesController],
    exports: [
        CoursesService,
    ]
})
export class CoursesModule {}
