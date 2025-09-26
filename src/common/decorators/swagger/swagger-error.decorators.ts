import { applyDecorators } from '@nestjs/common';

import {
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiUnprocessableEntityResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { AuthErrors } from '@modules/auth/errors/auth.errors';

import { ErrorsResponse } from '../../responses';

const ERROR_SCHEMA: SchemaObject = {
  type: 'object',
  properties: {
    message: { type: 'string' },
  },
};

export const ApiAuthResponses = () => {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: 'Unauthorized (missing or invalid token)',
      schema: ERROR_SCHEMA,
      content: {
        'application/json': {
          examples: {
            missingToken: {
              summary: 'No token provided',
              value: AuthErrors.TOKEN_NOT_FOUND,
            },
            invalidToken: {
              summary: 'Malformed token',
              value: AuthErrors.INVALID_TOKEN,
            },
            expiredToken: {
              summary: 'Token has expired',
              value: AuthErrors.TOKEN_EXPIRED,
            },
          },
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Forbidden (insufficient role)',
      schema: ERROR_SCHEMA,
      content: {
        'application/json': {
          example: {
            message: 'Forbidden resource',
          },
        },
      },
    }),
  );
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
    schema: ERROR_SCHEMA,
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
        message: { type: 'array', items: { type: 'string' } },
      },
    },
    content: {
      'application/json': {
        example: {
          message: messagesExample,
        },
      },
    },
  });
};
