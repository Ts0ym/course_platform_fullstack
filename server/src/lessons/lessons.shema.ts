import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {LESSONS_COLLECTION_NAME, THEMES_SCHEMA_NAME} from "../constants";
import {Theme} from "../themes/themes.schema";

export enum LessonType {
    Text = 'text',
    Quiz = 'quiz',
    Video = 'video'
}

@Schema({collection: LESSONS_COLLECTION_NAME})
export class Lesson {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    type: LessonType; // Поле для определения типа урока

    @Prop({ required: true })
    description: string;

    // Дополнительные поля для различных типов уроков
    @Prop({ required: false }) // Текстовый урок
    text?: string;

    @Prop({ required: false }) // Урок-тест
    questions?: LessonQuestion[];

    @Prop({ required: false }) // Урок-видео
    videoUrl?: string;

    @Prop({ required: true })
    reward: number

    @Prop({ required: true })
    homework: boolean

    @Prop({type: Types.ObjectId || Theme, ref: THEMES_SCHEMA_NAME})
    themeId: Theme;

    @Prop({ required: false })
    homeworkText?: string
}

export interface LessonQuestion{
    question: string
    options: string[]
    correctAnswer: number
}

export type LessonDocument = Lesson & Document;
export const LessonSchema = SchemaFactory.createForClass(Lesson);