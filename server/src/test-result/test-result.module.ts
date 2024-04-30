import { Module } from '@nestjs/common';
import { TestResultService } from './test-result.service';
import { TestResultController } from './test-result.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../users/users.schema";
import {CourseProgress, CourseProgressSchema} from "../courses-progress/courses-progress.schema";
import {Course, CourseSchema} from "../courses/courses.schema";
import {Lesson, LessonSchema} from "../lessons/lessons.shema";
import {TestResult, TestResultSchema} from "./test-result.schema";

@Module({
  imports: [MongooseModule.forFeature([
    {name: User.name, schema: UserSchema},
    {name: Lesson.name, schema: LessonSchema},
    {name: TestResult.name, schema: TestResultSchema},
  ])],
  providers: [TestResultService],
  controllers: [TestResultController]
})
export class TestResultModule {}
