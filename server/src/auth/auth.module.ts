import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UsersModule} from "../users/users.module";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {AtStrategy} from "./atStrategy";
import {RtStrategy} from "./rtStrategy";
import {MailModule} from "../mail/mail.module";

@Module({
  imports: [
      UsersModule,
      MailModule,
      JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy]
})
export class AuthModule {}
