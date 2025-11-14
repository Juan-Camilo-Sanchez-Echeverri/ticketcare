import { TicketDocument } from '@modules/tickets/schemas';
import { UserDocument } from '@modules/users/schemas';

import { messagingProducts } from '../config';

import { formatDate, mapStatus } from '../helpers';

export const agentsManagementTemplate = (
  ticket: TicketDocument,
  user: UserDocument,
): object => {
  return {
    messaging_product: messagingProducts.whatsApp,
    to: `${user.phone}`,
    text: {
      body: `
      Hola, ${user.name} ${user.lastName}! 👋

      Te informamos que tienes una novedad con un ticket en la plataforma de *TicketCare*. Aquí están los detalles:

      *🔔 Novedad:*
      ${mapStatus(ticket.status)}

      *📋 Número de ticket:*
      ${ticket.serial}

      *👤 Nombre del cliente:*
      ${ticket.requestingUser.name} ${ticket.requestingUser.lastName}

      *🏢 Empresa/Entidad:*
      ${ticket?.businessClient?.name || 'N/A'}

      *🕒 Fecha/Hora de la novedad:*
      ${formatDate(ticket.updatedAt)}

      Por favor, ingresa a la plataforma para gestionarlo y mantener una excelente calificación de atención con tus clientes. ⭐`,
    },
  };
};
