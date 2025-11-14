import { TicketDocument } from '@modules/tickets/schemas';
import { UserDocument } from '@modules/users/schemas';

import { formatDate, formatName, mapPriority, mapStatus } from '../helpers';
import { messagingProducts } from '../config';

export const statusTemplate = (
  ticket: TicketDocument,
  user: Pick<UserDocument, 'name' | 'lastName' | 'phone'>,
): object => {
  return {
    messaging_product: messagingProducts.whatsApp,
    to: `${user.phone}`,
    text: {
      body: `
      Estimado ${user.name} ${user.lastName},

      Le informamos que su ticket número *${ticket.serial}*, para la empresa *${ticket?.businessContractor?.name ?? 'No Disponible'}*
      se encuentra en el estado *${mapStatus(ticket.status)}*. Los detalles son los siguientes:

      📆 *Fecha de creación:* ${formatDate(ticket.createdAt)}

      📥 *Dto actual:* ${ticket?.supportDepartment?.name ?? 'No Disponible'}

      📌 *Prioridad actual:* ${mapPriority(ticket.priorityUser)}

      🧑‍🚀 *Profesional asignado:* ${formatName(ticket)}

      Para obtener más información sobre su solicitud, lo invitamos a ingresar a la plataforma de TicketCare.`,
    },
  };
};
