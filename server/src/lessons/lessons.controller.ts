import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Query,
    UploadedFiles,
    UseInterceptors
} from "@nestjs/common";
import {LessonsService} from "./lessons.service";
import {LESSONS_COLLECTION_NAME} from "../constants";
import {CreateLessonDto} from "./lessons.dto";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {CoursesProgressService} from "../courses-progress/courses-progress.service";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {AuthResponseDto} from "../auth/auth.types";

@Controller(LESSONS_COLLECTION_NAME)
export class LessonsController {
    constructor(
        private lessonsService: LessonsService,
        private coursesProgressService: CoursesProgressService
    ) {}

    @ApiOperation({summary: "Принимает id пользователя и id урока и " +
            "возвращает объект урока, объект курса, объект темы, выполнен ли урок пользователем, домашние задания пользователя для данного урока"})
    @ApiResponse({
        status: HttpStatus.OK,
        type: AuthResponseDto,
        description: "Получен JWT refresh, access token и информация о пользователе",
        schema: {
            example: {
                lesson: {},
                course: {},
                theme: {},
                isCompleted: false,
                homeworks: [],
            }
        }
    })
    @Get()
    async getLessonByUser(@Query('userId') userId: string,
                          @Query('lessonId') lessonId: string
                          ,){
        console.log(userId)
        console.log(lessonId)
        return this.lessonsService.getLessonByUser(userId, lessonId)
    }

    @Get(":id")
    getOne(@Param("id") id : string){
        return this.lessonsService.getOne(id)
    }

    @Get()
    getAll(){
        return this.lessonsService.getAll()
    }

    @Post('video')
    @UseInterceptors(FileFieldsInterceptor([
        {name: "video", maxCount: 1}
    ]))
    async createVideoLesson(@Body() dto: CreateLessonDto, @UploadedFiles() files){
        const {video} = files
        return await this.lessonsService.createVideo(dto, video[0])
    }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
    ]))
    async create(@Body() dto: CreateLessonDto){
        return await this.lessonsService.create(dto)
    }

    @Delete(":id")
    delete(@Param('id') id : string){
        return this.lessonsService.delete(id)
    }
}
