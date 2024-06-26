import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HOMEWORKS_COLLECTION_NAME, HOMEWORKS_SCHEMA_NAME, LESSONS_SCHEMA_NAME, USERS_SCHEMA_NAME} from "../constants";
import {Types} from "mongoose";

export type homeworkStatus = "submitted" | "returned" | "graded"

@Schema({collection: HOMEWORKS_COLLECTION_NAME})
export class Homework {
    @Prop({type: Types.ObjectId, ref: LESSONS_SCHEMA_NAME})
    lessonId: Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: USERS_SCHEMA_NAME})
    userId: Types.ObjectId;

    @Prop({required: true})
    content: string

    @Prop({required: false})
    grade: number

    @Prop({required: false, default: Date.now})
    sendTime: Date

    @Prop({required: false})
    assessment: string

    @Prop({ required: true, default: 'submitted' })
    status: homeworkStatus

    @Prop({ type: Types.ObjectId, ref: HOMEWORKS_SCHEMA_NAME })
    previousVersion: Types.ObjectId;

}

export type HomeworkDocument = Homework & Document;

export const HomeworkSchema = SchemaFactory.createForClass(Homework);