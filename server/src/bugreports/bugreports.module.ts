import { Module } from '@nestjs/common';
import { BugreportsService } from './bugreports.service';
import { BugreportsController } from './bugreports.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {BugReport, BugReportSchema} from "./bugreports.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: BugReport.name, schema: BugReportSchema}
    ])
      ],
  providers: [BugreportsService],
  controllers: [BugreportsController]
})
export class BugreportsModule {}
