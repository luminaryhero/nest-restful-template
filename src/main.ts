import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  app.use(helmet());
  app.enableCors();

  const config = app.get(ConfigService);
  const host = config.get('http.host');
  const port = config.get('http.port');
  const url = `http://${host}:${port}`;

  await app.listen(port, () => {
    console.info(`APPLICATION STARTED AT ${url}`);
  });
}
bootstrap();
