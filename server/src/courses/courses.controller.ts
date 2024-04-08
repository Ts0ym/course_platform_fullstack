import {Body, Query, Controller, Delete, Get, Param, Post, UploadedFiles, UseInterceptors} from '@nestjs/common';
import {CoursesService} from "./courses.service";
import {CreateCourseDto, EnrollUserDto, GetCourseProgressDto} from "./courses.dto";
import {COURSES_COLLECTION_NAME} from "../constants";
import {FileFieldsInterceptor} from "@nestjs/platform-express"
import {CoursesProgressService} from "../courses-progress/courses-progress.service";
import {UsersService} from "../users/users.service";


@Controller(COURSES_COLLECTION_NAME)
export class CoursesController {
    constructor(
        private coursesService: CoursesService,
        private coursesProgressService: CoursesProgressService,
        private usersService: UsersService
    ) {}

    @Get("progress")
    async getCourseProgress(@Query() dto: GetCourseProgressDto){
        console.log(dto)
        const progress= await this.coursesProgressService.getCourseProgress(dto)
        const course = await this.coursesService.getOne(dto.courseId)
        return {progress, course}
    }

    @Get(":id")
    getOne(@Param("id") id : string){
        return this.coursesService.getOne(id)
    }

    @Get()
    getAll(){
        return this.coursesService.getAll()
    }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'image', maxCount: 1}
    ]))
    create(@Body() dto: CreateCourseDto, @UploadedFiles() files){
        console.log(dto)
        const {image} = files
        return this.coursesService.create(dto, image[0])
    }

    @Delete(":id")
    delete(@Param('id') id : string){
        return this.coursesService.delete(id)
    }

    @Post("enroll")
    enroll(@Body() dto: EnrollUserDto){
        return this.coursesService.enrollUser(dto)
    }

    @Get("lastcourse/:id")
    async getLastCourse(@Param('id') id : string){
        return await this.usersService.getLastCourse(id)

    }

    @Post("lastcourse")
    setLastCourse(@Body() dto: {courseId: string, userId: string}){
        return this.usersService.setLastCourse(dto)
    }

    @Get("usercourses/:id")
    async getUserCourses(@Param('id') id : string){
        return this.usersService.getUserCourses(id)
    }

    @Get("recommended/:id")
    async getRecommendedCourses(@Param('id') id : string){
        return this.usersService.getRecommendedCourses(id)
    }
}
