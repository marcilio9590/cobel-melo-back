import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log('Listening on port %d', port);
  });
}
bootstrap();
