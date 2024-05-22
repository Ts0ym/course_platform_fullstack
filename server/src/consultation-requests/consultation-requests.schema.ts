import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {Types} from "mongoose";
import {User} from "../users/users.schema";


@Schema({ collection: 'consultation-requests' })
export class ConsultationRequest{
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: User | string;

    @Prop({ required: true })
    requestDate: Date;

    @Prop({ required: true, default: 'pending' })
    status: 'pending' | 'approved' | 'rejected';

    @Prop({ required: false })
    comment: string;

    @Prop({ required: false })
    startTime: Date;

    @Prop({ required: false })
    endTime: Date;
}

export type ConsultationRequestDocument = ConsultationRequest & mongoose.Document;
export const ConsultationRequestSchema = SchemaFactory.createForClass(ConsultationRequest);