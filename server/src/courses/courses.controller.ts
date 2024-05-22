import {
    Body,
    Query,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UploadedFiles,
    UseInterceptors,
    Patch,
    UploadedFile, HttpStatus, HttpException
} from '@nestjs/common';
import {CoursesService} from "./courses.service";
import {CreateCourseDto, EnrollUserDto, GetCourseProgressDto, UpdateCourseDto} from "./courses.dto";
import {COURSES_COLLECTION_NAME} from "../constants";
import {FileFieldsInterceptor, FileInterceptor} from "@nestjs/platform-express"
import {CoursesProgressService} from "../courses-progress/courses-progress.service";
import {UsersService} from "../users/users.service";


@Controller(COURSES_COLLECTION_NAME)
export class CoursesController {
    constructor(
        private coursesService: CoursesService,
        private coursesProgressService: CoursesProgressService,
        private usersService: UsersService
    ) {}

    @Get('tags')
    async getUniqueTags() {
        return this.coursesService.getUniqueTags();
    }

    @Get("progress")
    async getCourseProgress(@Query() dto: GetCourseProgressDto){
        // console.log(dto)
        const progress= await this.coursesProgressService.getCourseProgress(dto)
        const course = await this.coursesService.getOne(dto.courseId)
        return {progress, course}
    }

    @Get(":id")
    getOne(@Param("id") id : string){
        return this.coursesService.getOne(id)
    }

    @Get("/shortinfo/:id")
    getShortInfo(@Param("id") id : string){
        return this.coursesService.getShortInfo(id)
    }

    @Get()
    async getCoursesByTagsAndSearch(
        @Query('tags') tags?: string,
        @Query('search') search?: string
    ) {
        const tagsArray = tags ? tags.split(',') : [];
        return this.coursesService.getCoursesByTagsAndSearch(tagsArray, search);
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

    @Patch(':id')
    @UseInterceptors(FileInterceptor('image'))  // Используйте FileInterceptor для загрузки изображений
    async updateCourse(@Param('id') id: string, @Body() dto: UpdateCourseDto, @UploadedFile() image: Express.Multer.File) {
        try {
            if (image) {
                dto.image = image;
            }
            const updatedCourse = await this.coursesService.updateCourse(id, dto);
            return updatedCourse;
        } catch (error) {
            throw new HttpException('Failed to update the course', HttpStatus.BAD_REQUEST);
        }
    }

    @Post("lastcourse")
    setLastCourse(@Body() dto: {courseId: string, userId: string}){
        return this.usersService.setLastCourse(dto)
    }

    @Get("usercourses/:id")
    async getUserCourses(@Param('id') id : string){
        return this.usersService.getUserCourses(id)
    }

    @Get('recommended/:id')
    async getRecommendedCourses(
        @Param('id') id: string,
        @Query('tags') tags?: string,
        @Query('search') search?: string
    ) {
        const tagsArray = tags ? tags.split(',') : [];
        return this.usersService.getRecommendedCourses(id, tagsArray, search);
    }

}
