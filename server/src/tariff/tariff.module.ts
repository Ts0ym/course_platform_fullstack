import { Module } from '@nestjs/common';
import { TariffController } from './tariff.controller';
import { TariffService } from './tariff.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Course, CourseSchema} from "../courses/courses.schema";
import {Tariff, TariffSchema} from "./tariff.schema";

@Module({
  imports: [MongooseModule.forFeature([
    {name: Course.name, schema: CourseSchema },
    {name: Tariff.name, schema: TariffSchema },
  ])],
  controllers: [TariffController],
  providers: [TariffService],
  exports: [TariffService]
})
export class TariffModule {}
