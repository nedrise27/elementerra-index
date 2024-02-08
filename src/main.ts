import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { urlencoded, json } from 'express';
import { CatchAllExceptionsFilter } from './error/CatchAllExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '265mb' }));
  app.use(urlencoded({ extended: true, limit: '265mb' }));
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new CatchAllExceptionsFilter(httpAdapter));

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  const config = new DocumentBuilder()
    .setTitle('Non official Elementerra tools API - by nedrise')
    .setDescription(
      'Repository at: https://github.com/nedrise27/elementerra-index',
    )
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
