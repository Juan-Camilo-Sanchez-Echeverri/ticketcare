import {
  Injectable,
  OnModuleInit,
  Logger,
  OnModuleDestroy,
} from '@nestjs/common';

import { ImapFlow, ExistsEvent } from 'imapflow';

import { simpleParser, ParsedMail } from 'mailparser';

import { imapConfig } from '@configs';

@Injectable()
export class EmailService implements OnModuleInit, OnModuleDestroy {
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
      this.logEmail(parsed);
    }
  }

  private logEmail(email: ParsedMail) {
    this.logger.log(`Subject: ${email.subject}`);
    this.logger.log(`From: ${JSON.stringify(email.from?.value)}`);
    this.logger.log(`➡️ Texto: ${email.text}`);
    this.logger.log(`➡️ HTML: ${email.html}`);

    email.attachments.forEach((att) => {
      this.logger.log(att);
    });
  }

  async onModuleDestroy() {
    await this.client.logout();
    this.logger.log('IMAP desconectado');
  }
}
