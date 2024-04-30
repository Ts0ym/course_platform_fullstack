import {Body, Controller, Get, Post, Query, Res} from '@nestjs/common';
import {TestResultService} from "./test-result.service";
import {CreateTestResultDto} from "./test-result.dto";

@Controller('test-result')
export class TestResultController {
    constructor(private testResultsService: TestResultService) {}

    @Post('')
    async create(@Body() createTestResultDto: CreateTestResultDto) {
        return this.testResultsService.create(createTestResultDto);
    }

    @Get('completed')
    async isTestCompleted(
        @Query('userId') userId: string,
        @Query('lessonId') lessonId: string,
    )
    {

        return await this.testResultsService.isTestCompleted(userId, lessonId);

    }
}
