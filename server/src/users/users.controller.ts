import {
    Body,
    Controller,
    Get,
    HttpException, HttpStatus, NotFoundException,
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


    @Get(':id/achievements')
    async getUserAchievements(@Param('id') userId: string) {
        return this.usersService.getUserAchievements(userId);
    }
    @Get("lastlesson/:id")
    async getLastLesson(@Param('id') id : string){
        return await this.usersService.getLastLesson(id)
    }

    @Get('/:id')
    async getUser(@Param('id') id : string){
        return await this.usersService.findById(id)
    }

    @Get("fulldata/:id")
    async getUserFullData(@Param('id') id : string){
        return await this.usersService.getFullUserData(id)
    }

    @Post("lastlesson")
    async setLastLesson(@Body() body: {userId: string, lessonId: string}){
        return await this.usersService.setLastLesson(body)
    }

    // @UseGuards(RolesGuard)
    // @Roles('admin')
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

    @Patch(':id/add-balance')
    async addBalance(@Param('id') userId: string, @Body('amount') amount: number) {
        return this.usersService.addBalance(userId, amount);
    }

    @Patch(':id/subtract-balance')
    async subtractBalance(@Param('id') userId: string, @Body('amount') amount: number) {
        return this.usersService.subtractBalance(userId, amount);
    }

    @Get(':id/check-achievements')
    async checkUserAchievements(@Param('id') userId: string) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return this.usersService.checkAchievements(userId);
    }
}
