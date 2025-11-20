import { randomUUID } from 'node:crypto';

import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import { ImapFlow } from 'imapflow';

import { ParsedMail, simpleParser } from 'mailparser';

import { imapConfig } from '@configs';

import { UserRole } from '@common/enums';

import { NotificationType } from '@modules/notifications/enums/notification-type.enum';
import { NotificationsService } from '@modules/notifications/notifications.service';
import { ticketFollowupEmail } from '@modules/notifications/templates/email';
import { StorageService } from '@modules/storage/storage.service';
import { TicketSource } from '@modules/tickets/enums';
import { TicketsService } from '@modules/tickets/tickets.service';
import { UsersService } from '@modules/users/users.service';
import { generateRandomPassword } from '@common/helpers';

@Injectable()
export class EmailService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly usersService: UsersService,
    private readonly storageService: StorageService,
    private readonly notificationsService: NotificationsService,
  ) {}
  private readonly logger = new Logger(EmailService.name);
  private client!: ImapFlow;

  async onModuleInit() {
    this.client = new ImapFlow(imapConfig);

    try {
      await this.client.connect();
      this.logger.log('✅ IMAP conectado');

      await this.client.mailboxOpen('INBOX');

      this.client.on('exists', () => {
        void this.handleNewEmails();
      });
    } catch (err) {
      this.logger.error('❌ Error conectando o procesando IMAP', err);
    }
  }

  private async handleNewEmails() {
    const searchResults = await this.client.search({ seen: false });

    if (!searchResults || searchResults.length === 0) return;

    for (const seq of searchResults) {
      const message = await this.client.fetchOne(seq, {
        envelope: true,
        source: true,
        flags: true,
      });

      if (!message || !message.source) continue;

      const parsed = await simpleParser(message.source);
      await this.processEmailTicket(parsed);

      await this.client.messageFlagsAdd(seq, ['\\Seen']);
    }
  }

  private async processEmailTicket(email: ParsedMail) {
    const emailFrom = email.from?.value.map((f) => f.address).join(', ');
    if (!emailFrom) return;

    const userName = email.from?.value[0]?.name || 'Usuario Desconocido';
    const subject = email.subject || 'Sin asunto';
    const text = email.textAsHtml ?? email.text ?? (email.html || '');

    email.attachments.forEach((att) => {
      this.logger.log(att);
    });

    let user = await this.usersService.findOneByQuery({ email: emailFrom });
    let newPassword = '';

    if (!user) {
      newPassword = generateRandomPassword();
      user = await this.usersService.create({
        name: userName,
        email: emailFrom,
        lastName: '',
        password: newPassword,
        role: UserRole.Client,
        modifiedBy: null,
      });

      await this.sendReplyNotification(user.email, newPassword);
    }

    const ticket = await this.ticketsService.create({
      title: subject,
      description: text,
      requestingUser: String(user._id),
      supportDepartment: null,
      businessClient: null,
      businessContractor: null,
      source: TicketSource.EMAIL,
    });

    const multimedia = [];

    for (const att of email.attachments) {
      const nameFile = att.filename?.replace(/[^\w.-]/g, '_') || randomUUID();

      const folder = `uploads/${String(user._id)}/tickets/${String(ticket._id)}/evidence/${nameFile}`;

      const fileUrl = await this.storageService.saveFile(
        att.content,
        folder,
        'local',
      );

      multimedia.push({ nameFile, url: fileUrl });
    }

    if (multimedia.length > 0) {
      ticket.evidence.multimedia.push(...multimedia);
      await ticket.save();
    }
  }

  async onModuleDestroy() {
    await this.client.logout();
    this.logger.log('IMAP desconectado');
  }

  private async sendReplyNotification(userEmail: string, password: string) {
    const htmlContent = ticketFollowupEmail(userEmail, password);
    const payload = {
      to: userEmail,
      subject: 'Seguimiento de Ticket en nuestra plataforma',
      html: htmlContent,
    };

    await this.notificationsService.send(NotificationType.EMAIL, payload);
  }
}
