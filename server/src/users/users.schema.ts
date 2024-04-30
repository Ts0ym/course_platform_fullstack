import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {Types} from "mongoose";
import {COURSES_SCHEMA_NAME, LESSONS_SCHEMA_NAME, USERS_COLLECTION_NAME} from "../constants";
import {Lesson} from "../lessons/lessons.shema";

@Schema({collection: USERS_COLLECTION_NAME, versionKey: false})
export class User {

    @Prop({required: true, type: String})
    password: string

    @Prop({required: true, type: String})
    name: string

    @Prop({required: true, type: String})
    surname: string

    @Prop({required: true, type: String, unique: true})
    email: string

    @Prop({required: true, type: String})
    role: string

    @Prop({required: true, type: String})
    balance: number

    @Prop({required: false, type: String})
    refreshToken: string

    @Prop({required: true, type: String})
    isActivated: boolean

    @Prop({required: false, type: String})
    activationToken: string

    @Prop({required: false, type: String})
    resetPasswordToken: string

    @Prop({required: false, type: [{type: Types.ObjectId, ref: COURSES_SCHEMA_NAME}]})
    coursesEnrolled: Types.ObjectId[]

    @Prop({required: false, type: Types.ObjectId || Lesson, ref: LESSONS_SCHEMA_NAME})
    lastVisitedLesson: Lesson | Types.ObjectId

    @Prop({required: false, type: String})
    avatar: string

    @Prop({required: false, type: String})
    aboutMe: string

    @Prop({required: false, type: [String]})
    socialLinks: string[]
}

export type UserDocument = User & mongoose.Document
export const UserSchema = SchemaFactory.createForClass(User)