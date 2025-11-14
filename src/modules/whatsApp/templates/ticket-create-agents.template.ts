import { messagingProducts } from '../config';
import { TicketDocument } from '@modules/tickets/schemas';
import { UserDocument } from '@modules/users/schemas';
import { formatDate } from '../helpers';

export const ticketCreateAgentsTemplate = (
  ticket: TicketDocument,
  user: UserDocument,
): object => {
  return {
    messaging_product: messagingProducts.whatsApp,
    to: `${user.phone}`,
    text: {
      body: `
      ¡Hola ${user.name} ${user.lastName}! 🌟

Te informamos que se ha creado un nuevo ticket en la plataforma de *TicketCare*. Aquí tienes los detalles:

      *🎫 Número de ticket:*
      ${ticket.serial}

      *👤 Nombre del remitente:*
      ${ticket.requestingUser.name} ${ticket.requestingUser.lastName}

      *🏢 Empresa/Entidad:*
      ${ticket?.businessClient?.name || ticket.businessContractor?.name || 'N/A'}

      *⏰ Fecha/Hora de llegada:*
      ${formatDate(ticket.createdAt)}

      Ingresa a la plataforma para gestionarlo y mantener una excelente calificación de atención con tus clientes. 👍✨`,
    },
  };
};
