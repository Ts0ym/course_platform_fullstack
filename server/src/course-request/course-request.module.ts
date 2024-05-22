import { Module } from '@nestjs/common';
import { CourseRequestService } from './course-request.service';
import { CourseRequestController } from './course-request.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Course, CourseSchema} from "../courses/courses.schema";
import {CourseRequest, CourseRequestSchema} from "./course-request.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: CourseRequest.name, schema: CourseRequestSchema },
    ]),
  ],
  providers: [CourseRequestService],
  controllers: [CourseRequestController]
})
export class CourseRequestModule {}
