import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {Types} from "mongoose";


@Schema({ collection: 'course-requests' }) // Название коллекции для заявок на курсы
export class CourseRequest{
    @Prop({ required: true })
    userName: string;

    @Prop({ required: true })
    userEmail: string;

    @Prop({ required: true })
    userPhone: string;

    @Prop({ required: true })
    course: Types.ObjectId; // Ссылка на курс

    @Prop({ required: true, default: false})
    checked: boolean;

    @Prop({ required: false })
    comment: string;

    @Prop({required: false, default: Date.now})
    sendTime: Date
}
export type CourseRequestDocument = CourseRequest & mongoose.Document
export const CourseRequestSchema = SchemaFactory.createForClass(CourseRequest);