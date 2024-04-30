import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {BUGREPORTS_COLLECTION_NAME} from "../constants";

@Schema({ collection: BUGREPORTS_COLLECTION_NAME })
export class BugReport {
    @Prop({ required: true, type: String })
    email: string;

    @Prop({ required: true, type: String })
    description: string;

    @Prop({ required: true, type: Number })
    severity: number;
}

export type BugReportDocument = BugReport & Document;
export const BugReportSchema = SchemaFactory.createForClass(BugReport);
