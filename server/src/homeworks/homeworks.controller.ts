import {Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query} from '@nestjs/common';
import {HomeworksService} from "./homeworks.service";
import {CreateHomeworkDto, RateHomeworkDto, UpdateHomeworkDto} from "./homeworks.dto";

@Controller('homeworks')
export class HomeworksController {
    constructor(private homeworksService: HomeworksService) {}

    @Get('/history')
    async getHomeworkHistory(
        @Query('lessonId') lessonId: string,
        @Query('userId') userId: string,
        @Query('homeworkId') homeworkId: string
    ) {
        try {
            const history = await this.homeworksService.getHomeworkHistory(lessonId, userId, homeworkId);
            return history;
        } catch (error) {
            throw new HttpException('Failed to get homework history: ' + error.message, HttpStatus.NOT_FOUND);
        }
    }

    @Put(':id/request-revision')
    async requestRevision(@Param('id') id: string, @Body() body: { comments: string }) {
        try {
            const updatedHomework = await this.homeworksService.requestRevision(id, body.comments);
            return updatedHomework;
        } catch (error) {
            throw new HttpException('Failed to request revision: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

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
    async getUncheckedHomeworks(){
        return this.homeworksService.getAllUnratedHomeworks();
    }

    @Get("checked")
    async getCheckedHomeworks(){
        return this.homeworksService.getAllCheckedHomeworks()
    }


    @Get('/:id')
    async getHomework(@Param('id') id: string) {
        return this.homeworksService.getHomeworkById(id);
    }

    @Post('/rate')
    async rateHomework(@Body() rateHomeworkDto: RateHomeworkDto) {
        console.log(rateHomeworkDto)
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
