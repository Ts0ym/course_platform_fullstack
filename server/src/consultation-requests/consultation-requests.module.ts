import { Module } from '@nestjs/common';
import { ConsultationRequestsService } from './consultation-requests.service';
import { ConsultationRequestsController } from './consultation-requests.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {ConsultationRequest, ConsultationRequestSchema} from "./consultation-requests.schema";
import {User, UserSchema} from "../users/users.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConsultationRequest.name, schema: ConsultationRequestSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [ConsultationRequestsService],
  controllers: [ConsultationRequestsController]
})
export class ConsultationRequestsModule {}
