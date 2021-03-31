import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GenericExceptionFilter } from './exceptions/generic-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GenericExceptionFilter());
  app.enableCors();
  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log('Listening on port %d', port);
  });
}
bootstrap();
