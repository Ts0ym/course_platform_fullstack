import {
    Body,
    Controller,
    Get,
    HttpException, HttpStatus,
    Param,
    Patch,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {UsersService} from "./users.service";
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {Roles, RolesGuard} from "../guards/roles.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import {UpdateUserDto} from "./users.dto";

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}


    @Get("lastlesson/:id")
    async getLastLesson(@Param('id') id : string){
        return await this.usersService.getLastLesson(id)
    }

    @Get('/:id')
    async getUser(@Param('id') id : string){
        return await this.usersService.findById(id)
    }

    @Post("lastlesson")
    async setLastLesson(@Body() body: {userId: string, lessonId: string}){
        return await this.usersService.setLastLesson(body)
    }
    @UseGuards(RolesGuard)
    @Roles('admin')
    @ApiTags('Users')
    @ApiOperation({summary: "Получить информацию о всех пользователях"})
    @Get('/')
    async getAllUsers() {
        return this.usersService.getAll();
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('avatar'))  // Используйте FileInterceptor для загрузки аватара
    async updateUser(
        @Param('id') id: string,
        @Body() dto: UpdateUserDto,
        @UploadedFile() avatar: Express.Multer.File
    ) {
        try {
            if (avatar) {
                dto.avatar = avatar;
            }
            const updatedUser = await this.usersService.updateUser(id, dto);
            return updatedUser;
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
}
