import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {
    COURSES_PROGRESS_COLLECTION_NAME,
    COURSES_SCHEMA_NAME,
    LESSONS_SCHEMA_NAME,
    USERS_SCHEMA_NAME
} from "../constants";

@Schema({collection: COURSES_PROGRESS_COLLECTION_NAME})
export class CourseProgress {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: USERS_SCHEMA_NAME, required: true })
    user: Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: COURSES_SCHEMA_NAME, required: true })
    course: Types.ObjectId;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: LESSONS_SCHEMA_NAME }) // Предполагается наличие схемы Lesson
    completedLessons: Types.ObjectId[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tariff', required: true })
    tariff: Types.ObjectId;

    @Prop({ required: true })
    startDate: Date;
}

export type CourseProgressDocument = CourseProgress & Document;
export const CourseProgressSchema = SchemaFactory.createForClass(CourseProgress);
