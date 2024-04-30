import {Body, Controller, Get, Post} from '@nestjs/common';
import {BugreportsService} from "./bugreports.service";
import {BugReport} from "./bugreports.schema";

@Controller('bugreports')
export class BugreportsController {
    constructor(private readonly bugReportService: BugreportsService) {}

    @Post()
    createBugReport(@Body() createDto: { email: string; description: string; severity: number }): Promise<BugReport> {
        return this.bugReportService.createBugReport(createDto);
    }

    @Get()
    getAllBugReports(): Promise<BugReport[]> {
        return this.bugReportService.getAllBugReports();
    }
}
