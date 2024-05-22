import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {Document, Types} from "mongoose";
import {COURSES_SCHEMA_NAME} from "../constants";
import {CourseProgress} from "../courses-progress/courses-progress.schema";

@Schema()
export class Tariff {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true})
    description: string;

    @Prop({ required: true })
    duration: number;  // Продолжительность доступа в днях

    @Prop({ required: true })
    price: number;

    @Prop({ required: false })
    freeConsultations: number;  // Количество бесплатных консультаций

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: COURSES_SCHEMA_NAME, required: true })
    course: Types.ObjectId;
}

export type TariffDocument = Tariff & Document;
export const TariffSchema = SchemaFactory.createForClass(Tariff);
