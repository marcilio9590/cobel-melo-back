import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GenericExceptionFilter } from './exceptions/generic-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://localhost:8080', 'https://cobel-melo.herokuapp.com', 'http://cobel-melo.herokuapp.com'],
      credentials: true,
    }
  });
  app.useGlobalFilters(new GenericExceptionFilter());
  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log('Listening on port %d', port);
  });
}
bootstrap();
