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

  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
