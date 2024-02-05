import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
