import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { FilesModule } from './files/files.module';
import { LessonsModule } from './lessons/lessons.module';
import { ThemesModule } from './themes/themes.module';
import { CoursesModule } from './courses/courses.module';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import { CoursesProgressModule } from './courses-progress/courses-progress.module';
import { HomeworksModule } from './homeworks/homeworks.module';
import { TestResultModule } from './test-result/test-result.module';
import { BugreportsModule } from './bugreports/bugreports.module';
import { CourseRequestModule } from './course-request/course-request.module';
import { ConsultationRequestsModule } from './consultation-requests/consultation-requests.module';
import { PaymentsModule } from './payments/payments.module';
import { MeetingsController } from './meetings/meetings.controller';
import { MeetingsModule } from './meetings/meetings.module';
import { TariffModule } from './tariff/tariff.module';
import { AchievementsModule } from './achievements/achievements.module';
import { ShopModule } from './shop/shop.module';
import * as path from 'path';

@Module({
  imports: [
      UsersModule,
      AuthModule,
      DatabaseModule,
      FilesModule,
      LessonsModule,
      ThemesModule,
      CoursesModule,
      MailModule,
      CoursesProgressModule,
      ServeStaticModule.forRoot({
          rootPath: path.resolve(__dirname, '..', 'static'),
      }),
      HomeworksModule,
      TestResultModule,
      BugreportsModule,
      CourseRequestModule,
      ConsultationRequestsModule,
      PaymentsModule,
      MeetingsModule,
      TariffModule,
      AchievementsModule,
      ShopModule,
  ],
  controllers: [AppController, MeetingsController],
  providers: [AppService, MailService],
})
export class AppModule {}
