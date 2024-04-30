import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {BugReport, BugReportDocument} from "./bugreports.schema";
import {Model} from "mongoose";

@Injectable()
export class BugreportsService {
    constructor(
        @InjectModel(BugReport.name) private bugReportModel: Model<BugReportDocument>
    ) {}

    async createBugReport(createDto: { email: string; description: string; severity: number }): Promise<BugReport> {
        const newBugReport = new this.bugReportModel(createDto);
        return newBugReport.save();
    }

    async getAllBugReports(): Promise<BugReport[]> {
        return this.bugReportModel.find().exec();
    }
}
