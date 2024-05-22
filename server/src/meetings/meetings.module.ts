import { Module } from '@nestjs/common';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Meeting, MeetingSchema} from "./meetings.schema";

@Module({
  imports: [
      MongooseModule.forFeature([
          { name: Meeting.name, schema: MeetingSchema }
      ])],
  controllers: [MeetingsController],
  providers: [MeetingsService],
  exports: [MeetingsService]
})
export class MeetingsModule {}
