import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {LESSONS_COLLECTION_NAME} from "../constants";

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
    content?: string;

    @Prop({ required: false }) // Урок-тест
    questions?: LessonQuestion[];

    @Prop({ required: false }) // Урок-видео
    videoUrl?: string;

    @Prop({ required: true })
    reward: number
}

export interface LessonQuestion{
    question: string
    options: string[]
    correctAnswer: number
}

export type LessonDocument = Lesson & Document;
export const LessonSchema = SchemaFactory.createForClass(Lesson);