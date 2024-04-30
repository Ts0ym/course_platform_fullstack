import {Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put} from '@nestjs/common';
import {HomeworksService} from "./homeworks.service";
import {CreateHomeworkDto, RateHomeworkDto, UpdateHomeworkDto} from "./homeworks.dto";

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

    @Get()
    async getHomeworks(){
        return this.homeworksService.getAllUnratedHomeworks();
    }

    @Get('/:id')
    async getHomework(@Param('id') id: string) {
        return this.homeworksService.getHomeworkById(id);
    }

    @Post('rate')
    async rateHomework(@Body() rateHomeworkDto: RateHomeworkDto) {
        try {
            const result = await this.homeworksService.rateHomework(
                rateHomeworkDto
            );
            return result;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'There was a problem rating the homework',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
