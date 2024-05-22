import { Module } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Achievement, AchievementSchema} from "./achievements.schema";
import {FilesService} from "../files/files.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Achievement.name, schema: AchievementSchema },
    ]),
  ],
  providers: [AchievementsService, FilesService],
  controllers: [AchievementsController]
})
export class AchievementsModule {}
