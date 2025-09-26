import { Injectable } from '@nestjs/common';

import { EmailNotificationService } from './providers';

import { INotificationProvider } from './interfaces/notification.interface';
import { EmailPayload } from './interfaces/email-payload.interface';

import { NotificationType } from './enums/notification-type.enum';

type PayloadByType = {
  [NotificationType.EMAIL]: EmailPayload;
};

@Injectable()
export class NotificationsService {
  private readonly providersMap: {
    [K in NotificationType]: INotificationProvider<PayloadByType[K]>;
  };

  constructor(private readonly emailService: EmailNotificationService) {
    this.providersMap = {
      [NotificationType.EMAIL]: this.emailService,
    };
  }

  async send<K extends NotificationType>(
    type: K,
    payload: PayloadByType[K],
  ): Promise<boolean> {
    const provider = this.providersMap[type];

    return provider.send(payload);
  }
}
