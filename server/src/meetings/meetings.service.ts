import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Meeting, MeetingDocument} from "./meetings.schema";
import {Model} from "mongoose";

@Injectable()
export class MeetingsService {
    constructor(@InjectModel(Meeting.name) private readonly meetingModel: Model<MeetingDocument>) {}

    async create(meetingData: any): Promise<Meeting> {
        try {
            const newMeeting = new this.meetingModel({
                email: meetingData.payload.email,
                name: meetingData.payload.scheduled_event.name || 'Unknown', // В случае если имя не задано, используем 'Unknown'
                startTime: new Date(meetingData.payload.scheduled_event.start_time),
                endTime: new Date(meetingData.payload.scheduled_event.end_time),
                createTime: new Date(meetingData.payload.scheduled_event.created_at),
                status: meetingData.payload.status,
                inviteeUri: meetingData.payload.uri, // URI приглашенного для идентификации
                cancel_url: meetingData.payload.cancel_url,
                join_url: meetingData.payload.scheduled_event?.location?.join_url,
                password: meetingData.payload.scheduled_event?.location.data.password,
            });
            return newMeeting.save();
        }catch (e) {
            console.log(e);
            throw e;
        }
    }

    async remove(inviteeUri: string): Promise<any> {
        return this.meetingModel.deleteOne({ inviteeUri: inviteeUri }).exec();
    }

    async findAllByEmail(email: string): Promise<Meeting[]> {
        try {
            const currentTime = new Date();
            return await this.meetingModel.find({
                email: email,
                endTime: { $gte: currentTime }
            }).exec();
        } catch (e) {
            throw e;
        }
    }
}
