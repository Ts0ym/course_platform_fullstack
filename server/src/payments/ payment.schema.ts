import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";

@Schema({ collection: 'payments' })
export class Payment {
    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    userId: Types.ObjectId;

    @Prop({ required: true, type: Types.ObjectId, ref: 'Course' })
    courseId: Types.ObjectId;

    @Prop({ required: true, type: Types.ObjectId, ref: 'Tariff' })
    tariffId: Types.ObjectId;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true, enum: ['pending', 'succeeded', 'failed'], default: 'pending' })
    status: string;

    @Prop({ required: true })
    paymentId: string; // ID платежа от платёжной системы
}

export type PaymentDocument = Payment & Document;
export const PaymentSchema = SchemaFactory.createForClass(Payment);