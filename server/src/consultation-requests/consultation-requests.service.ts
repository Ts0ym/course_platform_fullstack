import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {ConsultationRequest} from "./consultation-requests.schema";
import {Model} from "mongoose";

@Injectable()
export class ConsultationRequestsService {
    constructor(
        @InjectModel(ConsultationRequest.name) private consultationRequestModel: Model<ConsultationRequest>
    ) {}

    async createConsultationRequest(consultationRequest: ConsultationRequest): Promise<ConsultationRequest> {
        const newRequest = new this.consultationRequestModel(consultationRequest);
        return await newRequest.save();
    }

    async markRequestAsApproved(requestId: string, startTime: Date, endTime: Date): Promise<ConsultationRequest> {
        const request = await this.consultationRequestModel.findById(requestId).exec();
        if (!request) {
            throw new Error('Request not found');
        }

        request.status = 'approved';
        request.startTime = startTime;
        request.endTime = endTime;
        await request.save();

        return request;
    }

    async getPendingRequests(): Promise<ConsultationRequest[]> {
        return await this.consultationRequestModel.find({ status: 'pending' })
            .populate({
                path: 'user',
                model: 'User',
                select: "name surname _id email avatar"
            }).exec();
    }

    async getApprovedRequests(): Promise<ConsultationRequest[]> {
        return await this.consultationRequestModel.find({ status: 'approved' }).populate({
            path: 'user',
            model: 'User',
            select: "name surname _id email avatar"}).exec();
    }

    async getAllRequestsForUser(userId: string): Promise<ConsultationRequest[]> {
        return await this.consultationRequestModel.find({ user: userId }).exec();
    }

    async getApprovedRequestsForUser(userId: string): Promise<ConsultationRequest[]> {
        return await this.consultationRequestModel.find({ user: userId, status: 'approved' }).exec();
    }

    async getPendingRequestsForUser(userId: string): Promise<ConsultationRequest[]> {
        return await this.consultationRequestModel.find({ user: userId, status: 'pending' }).exec();
    }
}
