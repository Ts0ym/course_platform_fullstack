// src/meetings/meeting.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MeetingDocument = Meeting & Document;

@Schema({ collection: 'meetings' })
export class Meeting {
    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    startTime: Date;

    @Prop()
    endTime: Date;

    @Prop()
    createTime: Date;

    @Prop()
    status: string;  // Например, "scheduled", "canceled"

    @Prop()
    inviteeUri: string

    @Prop()
    cancel_url: string

    @Prop()
    join_url: string

    @Prop()
    password: string


}

export type MeetingRequestDocument = Meeting & Document;
export const MeetingSchema = SchemaFactory.createForClass(Meeting);