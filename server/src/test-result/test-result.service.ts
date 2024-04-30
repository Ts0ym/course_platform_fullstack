import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {TestResult, TestResultDocument} from "./test-result.schema";
import {Model} from "mongoose";
import {CreateTestResultDto} from "./test-result.dto";

@Injectable()
export class TestResultService {
    constructor(@InjectModel(TestResult.name) private testResultModel: Model<TestResultDocument>) {}

    async create(createTestResultDto: CreateTestResultDto): Promise<TestResult> {
        const testResult = new this.testResultModel(createTestResultDto);
        return testResult.save();
    }

    async isTestCompleted(userId: string, lessonId: string) {
        return await this.testResultModel.findOne({
            userId: userId,
            lessonId: lessonId
        }).exec();
    }
}
