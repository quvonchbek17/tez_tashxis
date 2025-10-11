import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({origin: "*"})
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1');

  const config = app.get(ConfigService);

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tez Tashxis API')
    .setDescription('Tez Tashxis backend API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = config.getOrThrow('app.port');
  await app.listen(port);
}
bootstrap();
