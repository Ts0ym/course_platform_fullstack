import {Body, Controller, Delete, Param, Post, Put} from '@nestjs/common';
import {HomeworksService} from "./homeworks.service";
import {CreateHomeworkDto, UpdateHomeworkDto} from "./homeworks.dto";

@Controller('homeworks')
export class HomeworksController {
    constructor(private homeworksService: HomeworksService) {}

    @Post()
    async createHomework(@Body() dto: CreateHomeworkDto) {
        return this.homeworksService.create(dto);
    }

    @Put('/:id')
    async updateHomework(@Param('id') id: string, @Body() dto: UpdateHomeworkDto) {
        return this.homeworksService.updateHomework(id, dto);
    }

    @Delete('/:id')
    async deleteHomework(@Param('id') id: string) {
        return this.homeworksService.deleteHomework(id);
    }

}
