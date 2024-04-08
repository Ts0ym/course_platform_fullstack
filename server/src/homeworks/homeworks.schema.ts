import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HOMEWORKS_COLLECTION_NAME, LESSONS_SCHEMA_NAME, USERS_SCHEMA_NAME} from "../constants";
import {Types} from "mongoose";

@Schema({collection: HOMEWORKS_COLLECTION_NAME})
export class Homework {
    @Prop({type: [Types.ObjectId], default: [], ref: LESSONS_SCHEMA_NAME})
    lessonId: Types.ObjectId[];

    @Prop({type: [Types.ObjectId], default: [], ref: USERS_SCHEMA_NAME})
    userId: Types.ObjectId[];

    @Prop({required: true})
    content: string

    @Prop({required: false})
    grade: number

    @Prop({required: false, default: Date.now})
    sendTime: Date

}

export type HomeworkDocument = Homework & Document;

export const HomeworkSchema = SchemaFactory.createForClass(Homework);