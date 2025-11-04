import {
  Injectable,
  OnModuleInit,
  Logger,
  OnModuleDestroy,
} from '@nestjs/common';

import { ImapFlow, ExistsEvent } from 'imapflow';

import { simpleParser, ParsedMail } from 'mailparser';

import { imapConfig } from '@configs';

import { UsersService } from '@modules/users/users.service';
import { TicketsService } from '@modules/tickets/tickets.service';
import { UserRole } from '../../common/enums';
import { TicketSource } from '../tickets/enums';

@Injectable()
export class EmailService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly usersService: UsersService,
  ) {}
  private readonly logger = new Logger(EmailService.name);
  private client!: ImapFlow;

  async onModuleInit() {
    this.client = new ImapFlow(imapConfig);

    try {
      await this.client.connect();
      this.logger.log('✅ IMAP conectado');

      await this.client.mailboxOpen('INBOX');

      this.client.on('exists', (event: ExistsEvent) => {
        this.logger.log({ event });
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
        // envelope: true,
        source: true,
        flags: true,
      });

      if (!message || !message.source) continue;

      const parsed = await simpleParser(message.source);
      await this.logEmail(parsed);
    }
  }

  private async logEmail(email: ParsedMail) {
    const emailFrom = email.from?.value.map((f) => f.address).join(', ');
    const userName = email.from?.value[0]?.name || 'Usuario';
    const subject = email.subject || 'Sin asunto';
    const text = email.text || 'Sin contenido';

    console.table(email);

    email.attachments.forEach((att) => {
      this.logger.log(att);
    });

    let user = await this.usersService.findOneByQuery({ email: emailFrom });

    if (!user) {
      user = await this.usersService.create({
        name: userName,
        email: emailFrom || '<desconocido>',
        lastName: '',
        password: this.generateRandomPassword(),
        role: UserRole.Client,
        modifiedBy: null,
      });
    }

    await this.ticketsService.create({
      title: subject,
      description: text,
      requestingUser: String(user._id),
      supportDepartment: null,
      businessClient: null,
      businessContractor: null,
      source: TicketSource.EMAIL,
    });
  }

  async onModuleDestroy() {
    await this.client.logout();
    this.logger.log('IMAP desconectado');
  }

  private generateRandomPassword(): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';

    let password = '';
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));

    const allChars = uppercase + lowercase + numbers;
    for (let i = 0; i < 4; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    return password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');
  }
}
