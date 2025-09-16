import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

const swaggerConfig = new DocumentBuilder()
  .setTitle('API TicketCare')
  .setDescription('The API for the TicketCare project')
  .setVersion('1.0.0')
  .addGlobalResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      type: 'object',
      properties: { message: { type: 'string' } },
    },
    example: { message: 'Internal Server Error' },
  })
  .addBearerAuth()
  .build();

const swaggerDocOptions: SwaggerDocumentOptions = {
  ignoreGlobalPrefix: false,
};

export const setupSwagger = (app: INestApplication) => {
  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerDocOptions,
  );

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
      tagsSorter: 'alpha',
    },
  });
};
