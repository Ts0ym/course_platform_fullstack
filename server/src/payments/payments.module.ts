import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Course, CourseSchema} from "../courses/courses.schema";
import {Tariff, TariffSchema} from "../tariff/tariff.schema";
import {Payment, PaymentSchema} from "./ payment.schema";
import {CoursesService} from "../courses/courses.service";
import {CoursesModule} from "../courses/courses.module";

@Module({
  imports: [
      MongooseModule.forFeature([
        {name: Payment.name, schema: PaymentSchema },
      ]),
      CoursesModule
],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
