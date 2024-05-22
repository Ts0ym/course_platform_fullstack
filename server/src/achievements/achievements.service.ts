import { Injectable } from '@nestjs/common';
import {Achievement, AchievementDocument} from "./achievements.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {CreateAchievementDto, UpdateAchievementDto} from "./achievements.dto";
import {FilesService, FileTypes} from "../files/files.service";

@Injectable()
export class AchievementsService {
    constructor(
        @InjectModel(Achievement.name) private readonly achievementModel: Model<AchievementDocument>,
        private readonly filesService: FilesService
    ) {}

    async create(dto: CreateAchievementDto, image): Promise<Achievement> {
        const imageFileName = await this.filesService.createFile(image, FileTypes.IMAGE);
        const achievement = new this.achievementModel({...dto, icon: imageFileName});
        return achievement.save();
    }

    async getAll(): Promise<Achievement[]> {
        return this.achievementModel.find().exec();
    }

    async getById(id: string): Promise<Achievement> {
        return this.achievementModel.findById(id).exec();
    }

    async update(id: string, dto: UpdateAchievementDto): Promise<Achievement> {
        return this.achievementModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    }

    async delete(id: string): Promise<Achievement> {
        return this.achievementModel.findByIdAndDelete(id).exec();
    }
}
