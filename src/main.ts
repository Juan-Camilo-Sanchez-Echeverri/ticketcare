import { NestFactory } from '@nestjs/core';

import {
  ConsoleLogger,
  UnprocessableEntityException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';

import { NestExpressApplication } from '@nestjs/platform-express';

import compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';

import { getClassValidatorErrors } from '@common/helpers';

import { envs, setupSwagger } from '@configs';

const logger = new ConsoleLogger({ prefix: 'TicketCare' });

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger,
  });

  /**
   * Use helmet and compression for security and performance.
   */
  app.use(compression());
  app.use(helmet());

  app.set('trust proxy', true);
  app.set('query parser', 'extended');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors): UnprocessableEntityException => {
        const message = 'Validation failed';
        const errors = getClassValidatorErrors(validationErrors);

        return new UnprocessableEntityException({ message, errors });
      },
    }),
  );

  /**
   * Set the global prefix, enable cors and use global pipes.
   */
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1.0',
  });

  /**
   * Enable cors.
   */
  app.enableCors();

  /**
   * Create the swagger document and setup the swagger module.
   */
  setupSwagger(app);

  /**
   * Start the application.
   */
  await app.listen(envs.port);
  logger.log(`Server running on ${await app.getUrl()} 🚀 in ${envs.nodeEnv}`);
}

bootstrap().catch((err) => {
  logger.error('Error during app bootstrap', err);
  process.exit(1);
});
