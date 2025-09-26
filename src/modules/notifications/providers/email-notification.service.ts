import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { INotificationProvider } from '../interfaces/notification.interface';

import nodemailer from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';

import { EmailPayload } from '../interfaces/email-payload.interface';

import { emailConfig } from '../config';

@Injectable()
export class EmailNotificationService
  implements INotificationProvider<EmailPayload>
{
  private logger = new Logger(EmailNotificationService.name);

  async send(payload: EmailPayload): Promise<boolean> {
    try {
      const transporter = nodemailer.createTransport(emailConfig.smtp);

      const mailOptions: Options = {
        from: emailConfig.smtp.auth.user,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      };

      const response = await transporter.sendMail(mailOptions);

      this.logger.debug(`Response: ${JSON.stringify(response)}`);
      // return response.accepted === 202;
      return true;
    } catch (error) {
      this.logger.error('Error sending email:', error);

      throw new InternalServerErrorException('Error sending mail');
    }
  }
}
