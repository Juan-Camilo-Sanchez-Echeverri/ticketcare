import { Injectable } from '@nestjs/common';

import { UserRole } from '@common/enums';
import { generateRandomPassword } from '@common/helpers';

import { UsersService } from '@modules/users/users.service';
import { TicketsService } from '@modules/tickets/tickets.service';
import { NotificationsService } from '@modules/notifications/notifications.service';
import { TicketSource } from '@modules/tickets/enums';
import { NotificationType } from '@modules/notifications/enums/notification-type.enum';
import { ticketFollowupEmail } from '@modules/notifications/templates/email';

import { WhatsAppContact, WhatsAppMessage } from './dto/whatsapp-webhook.dto';

import { WhatsAppService } from './whatsApp.service';

@Injectable()
export class MessageHandler {
  constructor(
    private readonly whatsAppService: WhatsAppService,
    private readonly ticketsService: TicketsService,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  private assistantState: Record<
    string,
    { step?: string; [key: string]: unknown }
  > = {};

  async handleIncomingMessage(
    message: WhatsAppMessage,
    senderInfo: WhatsAppContact,
  ) {
    if (message?.type === 'text' && message.from) {
      const incomingMessage = String(message?.text?.body)?.trim();
      const incomingMessageLower = incomingMessage.toLowerCase();

      const userState = this.assistantState[message.from];

      if (userState?.step === 'awaiting_ticket_description') {
        await this.createTicketFromWhatsApp(
          message.from,
          incomingMessage,
          senderInfo,
        );
        await this.whatsAppService.markAsRead(message.id!);
        return;
      }

      if (this.isGreeting(incomingMessageLower)) {
        await this.sendWelcomeMessage(message.from, senderInfo);
        await this.sendWelcomeMenu(message.from);
      } else {
        await this.handleMenuOption(message.from, incomingMessageLower);
      }

      await this.whatsAppService.markAsRead(message.id!);
    } else if (message?.type === 'interactive') {
      const option = message?.interactive?.button_reply?.id;
      await this.handleMenuOption(message.from, option!);
      await this.whatsAppService.markAsRead(message.id!);
    }
  }

  async sendWelcomeMessage(to: string, senderInfo: WhatsAppContact) {
    const name = this.getSenderName(senderInfo);
    const welcomeMessage = `Hola ${name}, Bienvenido a nuestro servicio de atención al cliente. ¿En qué puedo ayudarte hoy?`;

    await this.whatsAppService.sendMessage(to, welcomeMessage);
  }

  isGreeting(message: string): boolean {
    const greetings = ['hola', 'buenas tardes', 'buenos días'];
    return greetings.includes(message);
  }

  getSenderName(senderInfo: WhatsAppContact): string {
    return senderInfo?.profile?.name || senderInfo?.wa_id || 'cliente';
  }

  async sendWelcomeMenu(to: string) {
    const menuMessage = 'Elige una Opción';
    const buttons = [
      {
        type: 'reply',
        reply: { id: 'option_1', title: 'Crear Ticket de Soporte' },
      },
    ];

    await this.whatsAppService.sendInteractiveButtons(to, menuMessage, buttons);
  }

  async handleMenuOption(to: string, option: string) {
    let response;

    switch (option) {
      case 'option_1':
        this.assistantState[to] = { step: 'awaiting_ticket_description' };
        response =
          'Realiza tu Ticket de Soporte, Por Favor describe tu problema.';
        break;
      default:
        response =
          'Lo siento, no entendí tu selección, Por Favor, elige una de las opciones del menú.';
    }

    await this.whatsAppService.sendMessage(to, response);
  }

  private async createTicketFromWhatsApp(
    phoneNumber: string,
    description: string,
    senderInfo: WhatsAppContact,
  ) {
    const userName = this.getSenderName(senderInfo);
    const formattedPhone = `+${phoneNumber}`;

    let user = await this.usersService.findOneByQuery({
      phone: formattedPhone,
    });

    let newPassword = '';
    let isNewUser = false;

    if (!user) {
      newPassword = generateRandomPassword();
      const provisionalEmail = `${phoneNumber}@ticketcare.com`;

      user = await this.usersService.create({
        name: userName,
        email: provisionalEmail,
        lastName: '',
        password: newPassword,
        phone: formattedPhone,
        role: UserRole.Client,
        modifiedBy: null,
      });

      isNewUser = true;
    }

    await this.ticketsService.create({
      title: `Ticket WhatsApp - ${userName}`,
      description: description,
      requestingUser: String(user._id),
      supportDepartment: null,
      businessClient: null,
      businessContractor: null,
      source: TicketSource.WHATSAPP,
    });

    delete this.assistantState[phoneNumber];

    if (isNewUser) {
      await this.sendCredentialsNotification(user.email, newPassword);
    }

    await this.whatsAppService.sendMessage(
      phoneNumber,
      '✅ Tu ticket ha sido creado exitosamente. Nos pondremos en contacto contigo pronto.',
    );
  }

  private async sendCredentialsNotification(
    userEmail: string,
    password: string,
  ) {
    const htmlContent = ticketFollowupEmail(userEmail, password);
    const payload = {
      to: userEmail,
      subject: 'Seguimiento de Ticket en nuestra plataforma',
      html: htmlContent,
    };

    await this.notificationsService.send(NotificationType.EMAIL, payload);
  }
}
