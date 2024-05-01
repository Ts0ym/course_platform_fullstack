import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {AllExceptionsFilter} from "./middleware/AllExceptionsFilter";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const PORT = process.env.PORT || 5005
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.ORIGIN || 'http://localhost:3000', // Укажите адрес вашего фронтенд-приложения
    credentials: true
  })
  app.useGlobalFilters(new AllExceptionsFilter());
  const config = new DocumentBuilder()
      .setTitle('Design Platform API Docs')
      .setDescription('Документация API')
      .setVersion('1.0')
      .addTag('designPlatform')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}
bootstrap();
