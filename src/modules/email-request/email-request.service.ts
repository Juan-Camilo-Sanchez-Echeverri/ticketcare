import { randomBytes } from 'node:crypto';

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Cron, CronExpression } from '@nestjs/schedule';

import { DateHelper } from '@common/helpers';

import { recoverPassword } from '@modules/notifications/templates/email';
import { NotificationType } from '@modules/notifications/enums/notification-type.enum';
import { NotificationsService } from '@modules/notifications/notifications.service';

import { EmailRequestDto, ValidateEmailRequest } from './dto';
import { TypeRequest } from './types/type-request';

import { EmailRequestErrors } from './errors/email-request.errors';

import { EmailRequestRepository } from './repositories/email-request.repository';

import { EmailRequest } from './schemas/email-request.schema';

interface DataEmailSend {
  email: string;
  token: string;
}

const MAX_ATTEMPTS = 3;

@Injectable()
export class EmailRequestService {
  constructor(
    private readonly emailRequestRepository: EmailRequestRepository,
    private readonly notificationService: NotificationsService,
  ) {}

  async create(data: EmailRequestDto) {
    const { email, type, expiresIn } = data;

    const token = this.generateToken();

    const existingRequest = await this.emailRequestRepository.findOne({
      email,
    });

    if (existingRequest) this.validateAttempts(existingRequest, type);

    const update = {
      $set: { [`${type}.token`]: token, [`${type}.expiresIn`]: expiresIn },
      $inc: { [`${type}.attempts`]: 1 },
    };

    if (type === 'recoverPassword') {
      await this.sendEmailRecoverPassword({ email, token });
    }

    await this.emailRequestRepository.findOneAndUpdate({ email }, update, {
      new: true,
      upsert: true,
    });
  }

  async validate(validateEmailRequest: ValidateEmailRequest) {
    const { email, token, type } = validateEmailRequest;

    const request = await this.emailRequestRepository.findOne({ email });

    if (!request || request[type]?.token !== token) {
      throw new NotFoundException(EmailRequestErrors.TOKEN_INVALID);
    }

    if (this.checkExpiration(request, type)) {
      throw new ConflictException(EmailRequestErrors.TOKEN_EXPIRED);
    }

    await this.emailRequestRepository.findOneAndUpdate(
      { email },
      { $set: { [`${type}.token`]: '', [`${type}.expiresIn`]: '' } },
    );
  }

  private checkExpiration(request: EmailRequest, type: TypeRequest): boolean {
    const { expiresIn } = request[type] || {};

    if (!expiresIn) {
      throw new NotFoundException(
        EmailRequestErrors.REQUEST_NOT_FOUND_OR_EXPIRED,
      );
    }

    return DateHelper.checkExpiration(expiresIn);
  }

  private async sendEmailRecoverPassword(data: DataEmailSend) {
    const dataEmail = {
      to: data.email,
      subject: 'Recuperar contraseña',
      html: recoverPassword(data),
    };

    return this.notificationService.send(NotificationType.EMAIL, dataEmail);
  }

  private validateAttempts(request: EmailRequest, type: TypeRequest): void {
    if (request[type] && request[type].attempts >= MAX_ATTEMPTS) {
      throw new ConflictException(EmailRequestErrors.MAX_ATTEMPTS_REACHED);
    }
  }

  private generateToken(): string {
    return randomBytes(20).toString('hex');
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'cleanExpiredRequests' })
  async cleanExpiredRequests() {
    await this.emailRequestRepository.deleteMany({});
  }
}
