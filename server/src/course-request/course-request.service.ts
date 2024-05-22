import { Injectable } from '@nestjs/common';
import {CourseRequest} from "./course-request.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class CourseRequestService {
    constructor(
        @InjectModel(CourseRequest.name) private courseRequestModel: Model<CourseRequest>,
    ) {}

    async findAll(): Promise<CourseRequest[]> {
        return this.courseRequestModel.find().exec();
    }

    async findChecked(): Promise<CourseRequest[]> {
        return this.courseRequestModel.find({ checked: true }).populate({
            path: 'course',
            model: 'Course',
            select: "_id title"
        }).exec();
    }

    async findUnchecked(): Promise<CourseRequest[]> {
        return this.courseRequestModel.find({ checked: false }).populate({
            path: 'course',
            model: 'Course',
            select: "_id title"
        }).exec();
    }

    async findById(id: string): Promise<CourseRequest> {
        return this.courseRequestModel.findById(id).exec();
    }

    async create(courseRequest: CourseRequest): Promise<CourseRequest> {
        const createdCourseRequest = new this.courseRequestModel(courseRequest);
        return createdCourseRequest.save();
    }

    async update(id: string, courseRequest: CourseRequest): Promise<CourseRequest> {
        return this.courseRequestModel.findByIdAndUpdate(id, courseRequest, { new: true }).exec();
    }

    async delete(id: string): Promise<CourseRequest> {
        return this.courseRequestModel.findByIdAndDelete(id).exec();
    }

    async markRequestAsChecked(requestId: string): Promise<CourseRequest> {
        const request = await this.courseRequestModel.findById(requestId).exec();
        if (!request) {
            throw new Error('Request not found');
        }

        request.checked = true;
        await request.save();

        return request;
    }
}
