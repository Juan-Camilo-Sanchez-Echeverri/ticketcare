import { NestFactory } from '@nestjs/core';

import { ConsoleLogger, VersioningType } from '@nestjs/common';

import { NestExpressApplication } from '@nestjs/platform-express';

import compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';

import { envs } from '@configs';

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
   * Start the application.
   */

  await app.listen(envs.port);
  logger.log(`Server running on ${await app.getUrl()} 🚀 in ${envs.nodeEnv}`);
}

bootstrap().catch((err) => {
  logger.error('Error during app bootstrap', err);
  process.exit(1);
});
