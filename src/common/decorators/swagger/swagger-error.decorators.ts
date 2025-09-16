import {
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { ErrorsResponse } from '../../responses';

const ERROR_SCHEMA: SchemaObject = {
  type: 'object',
  properties: {
    code: { type: 'number' },
    message: { type: 'string' },
  },
};

const ERROR_NULL_SCHEMA: SchemaObject = {
  type: 'object',
  properties: {
    code: { type: 'null' },
    message: { type: 'string' },
  },
};

export const ApiNotFoundResponseWrapper = (example: ErrorsResponse) => {
  return ApiNotFoundResponse({
    description: 'Not Found (resource not found)',
    schema: ERROR_SCHEMA,
    content: {
      'application/json': {
        example,
      },
    },
  });
};

export const ApiConflictResponseWrapper = (example: ErrorsResponse) => {
  return ApiConflictResponse({
    description: 'Conflict – duplicate resource or business rule violation',
    schema: ERROR_NULL_SCHEMA,
    content: {
      'application/json': {
        example,
      },
    },
  });
};

export const ApiValidationResponseWrapper = (messagesExample: string[]) => {
  return ApiUnprocessableEntityResponse({
    description: 'Unprocessable Entity – validation failed',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'null' },
        message: { type: 'array', items: { type: 'string' } },
      },
    },
    content: {
      'application/json': {
        example: {
          code: null,
          message: messagesExample,
        },
      },
    },
  });
};
