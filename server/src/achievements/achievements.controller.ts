import {Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors} from '@nestjs/common';
import {CreateAchievementDto, UpdateAchievementDto} from "./achievements.dto";
import {AchievementsService} from "./achievements.service";
import {FileFieldsInterceptor} from "@nestjs/platform-express";

@Controller('achievements')
export class AchievementsController {
    constructor(private readonly achievementService: AchievementsService) {}

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'image', maxCount: 1}
    ]))
    async create(@Body() dto: CreateAchievementDto, @UploadedFiles() files) {
        const {image} = files
        return this.achievementService.create(dto, image[0]);
    }

    @Get()
    async getAll() {
        return this.achievementService.getAll();
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        return this.achievementService.getById(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateAchievementDto) {
        return this.achievementService.update(id, dto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.achievementService.delete(id);
    }
}
