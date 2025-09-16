import { Request, Response } from 'express';

import { Injectable, Logger } from '@nestjs/common';

import { createLogger, format, transports } from 'winston';

@Injectable()
export class LogService {
  logger = new Logger('', { timestamp: true });

  saveFileLog(req: Request, res: Response): void {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    const fileErrorTransport = new transports.File({
      filename: `logs/${formattedDate}-info.log`,
      format: format.combine(
        format.json(),
        format.printf((info) => JSON.stringify(info.message)),
      ),
    });

    const logger = createLogger({ transports: [fileErrorTransport] });

    const requestOrigin = this.resolveRequestOrigin(req);

    const messageLog = `
    Method: ${req.method},
    Request Origin: ${requestOrigin},
    UserId: ${String(req.user._id)},
    Time: ${date.toLocaleTimeString()},
    Path: ${req.path},
    Status: ${res.statusCode}
    `;

    logger.info(messageLog);
  }

  resolveRequestOrigin(req: Request): string | null {
    const originHeader = req.get('Origin') || req.get('Referer');
    if (originHeader) return originHeader;

    const protocol = req.protocol || 'http';
    const host = req.get('Host');

    return host ? `${protocol}://${host}` : null;
  }

  errorLog(exception: Error) {
    this.logger.error(exception.message, exception.stack);
  }
}
