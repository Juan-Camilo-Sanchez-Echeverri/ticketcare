import { PriorityTicket, StatusTicket } from '@modules/tickets/enums';
import { TicketDocument } from '@modules/tickets/schemas';

export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const formatDate = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ?? 12;
  const strHours = hours.toString().padStart(2, '0');

  return `${day}/${month}/${year} - ${strHours}:${minutes} ${formatDate}`;
};

const statusMap = {
  [StatusTicket.OPEN]: 'Abierto',
  [StatusTicket.CLOSED]: 'Cerrado',
  [StatusTicket.IN_PROGRESS]: 'En progreso',
  [StatusTicket.RESOLVED]: 'Resuelto',
  [StatusTicket.ASSIGNED]: 'Asignado',
  [StatusTicket.CHANGE_AGENT]: 'Cambio de agente',
  [StatusTicket.CHANGE_DEPARTMENT]: 'Cambio de departamento',
  [StatusTicket.CHANGE_LEVEL]: 'Cambio de nivel',
  [StatusTicket.PENDING_RESPONSE]: 'Pendiente respuesta del cliente',
  [StatusTicket.CLIENT_RESPONSE]: 'Cliente respondió',
};

export const mapStatus = (status: StatusTicket): string => statusMap[status];

const priorityMap = {
  [PriorityTicket.HIGH]: 'Alta',
  [PriorityTicket.MEDIUM]: 'Media',
  [PriorityTicket.LOW]: 'Baja',
};

export const mapPriority = (priority: PriorityTicket): string =>
  priorityMap[priority];

export const formatName = (ticket: TicketDocument): string => {
  const name = ticket?.assignedUser?.name;
  const lastName = ticket?.assignedUser?.lastName;

  if (name && lastName) return `${name} ${lastName}`;

  return 'Sin asignar';
};
