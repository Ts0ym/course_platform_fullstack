import {Body, Controller, Delete, Get, Param, Patch, Post, Put} from '@nestjs/common';
import {CourseRequestService} from "./course-request.service";
import {CourseRequest} from "./course-request.schema";

@Controller('course-request')
export class CourseRequestController {
    constructor(private readonly courseRequestService: CourseRequestService) {}
    @Get()
    async findAll(): Promise<CourseRequest[]> {
        return this.courseRequestService.findAll();
    }

    @Get('checked')
    async findChecked(): Promise<CourseRequest[]> {
        return this.courseRequestService.findChecked();
    }

    @Get('unchecked')
    async findUnchecked(): Promise<CourseRequest[]> {
        return this.courseRequestService.findUnchecked();
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<CourseRequest> {
        return this.courseRequestService.findById(id);
    }

    @Post()
    async create(@Body() courseRequest: CourseRequest): Promise<CourseRequest> {
        return this.courseRequestService.create(courseRequest);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() courseRequest: CourseRequest): Promise<CourseRequest> {
        return this.courseRequestService.update(id, courseRequest);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<CourseRequest> {
        return this.courseRequestService.delete(id);
    }

    @Patch(':id/check')
    async markRequestAsChecked(@Param('id') requestId: string) {
        return this.courseRequestService.markRequestAsChecked(requestId);
    }
}
