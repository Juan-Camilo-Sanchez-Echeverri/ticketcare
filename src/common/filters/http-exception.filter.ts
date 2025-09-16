import { Response } from 'express';

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { ExecModes } from '@common/enums';

import { envs } from '@configs';

import { ErrorsDetails, ErrorsResponse } from '../responses/errors.response';

import { LogService } from '@modules/log/log.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logService: LogService) {}

  catch(exception: Error | HttpException, host: ArgumentsHost): Response {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status: HttpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const isInternalServerError = Math.floor(status / 100) === 5;
    const isProdEnvironment = envs.nodeEnv !== ExecModes.LOCAL;

    if (isInternalServerError || !isProdEnvironment) {
      this.logService.errorLog(exception);
    }

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorMessage = this.extractMessage(exception);
    const errorCode = this.extractCode(exceptionResponse);
    const errors = this.extractErrors(exceptionResponse);

    const responseBody: ErrorsResponse = {
      code: errorCode,
      message: errorMessage,
      details: errors,
    };

    return response.status(status).json(responseBody);
  }

  private extractMessage(exception: Error | HttpException): string {
    return exception.constructor.name;
  }

  private extractCode(response: string | object): number | null {
    if (typeof response === 'object' && 'code' in response) {
      return response.code as number;
    }
    return null;
  }

  private extractErrors(response: string | object): Array<ErrorsDetails> {
    if (typeof response === 'object' && 'errors' in response) {
      return response.errors as Array<ErrorsDetails>;
    }

    let message: string;
    if (typeof response === 'object' && 'message' in response) {
      message = response.message as string;
    } else {
      message = response as string;
    }

    return [{ property: null, errors: [message] }];
  }
}
