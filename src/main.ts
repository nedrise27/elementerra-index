import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '265mb' }));
  app.use(urlencoded({ extended: true, limit: '265mb' }));

  const config = new DocumentBuilder()
    .setTitle('Non official Elementerra tools API - by nedrise')
    .setVersion('1.0')
    .addTag('Forge Attempts')
    .addTag('Data')
    .addTag('Administrative')
    .addTag('Stats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  await app.listen(3000, () => process?.send?.('ready'));
}

bootstrap();
