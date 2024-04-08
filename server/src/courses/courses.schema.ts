import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {Document, Types} from 'mongoose';
import {COURSES_COLLECTION_NAME, THEMES_SCHEMA_NAME} from "../constants";
import {ThemeDocument} from "../themes/themes.schema";


@Schema({collection: COURSES_COLLECTION_NAME})
export class Course {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: false })
    image: string;

    @Prop({ required: false })
    tags: string[];

    @Prop({ type: [Types.ObjectId], default: [], ref: THEMES_SCHEMA_NAME})
    themes: Types.ObjectId[];
}

export type CourseDocument = Course & Document;
export const CourseSchema = SchemaFactory.createForClass(Course);