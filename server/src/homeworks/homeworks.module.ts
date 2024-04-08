import { Module } from '@nestjs/common';
import { HomeworksService } from './homeworks.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Lesson, LessonSchema} from "../lessons/lessons.shema";
import {Homework, HomeworkSchema} from "./homeworks.schema";
import {User, UserSchema} from "../users/users.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lesson.name, schema: LessonSchema },
      { name: Homework.name, schema: HomeworkSchema },
      { name: User.name, schema: UserSchema },
    ])
  ],
  providers: [HomeworksService]
})
export class HomeworksModule {}
