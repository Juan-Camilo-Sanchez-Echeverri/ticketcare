import { UserDocument } from '@modules/users/schemas';
import { TicketDocument } from '@modules/tickets/schemas';
import { SupportDepartmentDocument } from '@modules/support-departments/schemas/support-department.schema';

export const messageAssignTicket = (
  user: UserDocument,
  ticket: TicketDocument,
) => {
  const firstName = user.name.split(' ')[0];
  const lastName = user.lastName.split(' ')[0];

  const department = ticket.supportDepartment.name;

  return `${firstName} ${lastName} del departamento ${department} ha tomado el ticket.`;
};

export const messageTransferAgent = (
  requestingUser: UserDocument,
  assignedUser: UserDocument,
  ticket: TicketDocument,
) => {
  const firstNameUserTransfer = requestingUser.name.split(' ')[0];
  const lastNameUserTransfer = requestingUser.lastName.split(' ')[0];

  const firstNameUserAssigned = assignedUser.name.split(' ')[0];
  const lastNameUserAssigned = assignedUser.lastName.split(' ')[0];

  return `${firstNameUserTransfer} ${lastNameUserTransfer} del departamento ${ticket.supportDepartment.name} ha transferido el ticket a ${firstNameUserAssigned} ${lastNameUserAssigned} del departamento ${ticket.supportDepartment.name}.`;
};

export const messageTransferDepartment = (
  user: UserDocument,
  ticket: TicketDocument,
  department: SupportDepartmentDocument,
) => {
  const firstName = user.name.split(' ')[0];
  const lastName = user.lastName.split(' ')[0];

  const departmentOldName = ticket.supportDepartment.name;

  return `${firstName} ${lastName} del departamento ${departmentOldName} ha transferido el ticket al departamento ${department.name}.`;
};
