import { UserDocument } from '@modules/users/schemas';
import { TicketDocument } from '@modules/tickets/schemas';
import { SupportDepartmentDocument } from '@modules/support-departments/schemas/support-department.schema';

export const messageAssignTicket = (
  user: UserDocument,
  ticket: TicketDocument,
) => {
  const firstName = user.name.split(' ')[0];
  const lastName = user.lastName.split(' ')[0];

  const department = ticket?.supportDepartment?.name;
  const deptText = department ? ` del departamento ${department}` : '';

  return `${firstName} ${lastName}${deptText} ha tomado el ticket.`;
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

  const oldDept = ticket?.supportDepartment?.name;
  const oldDeptText = oldDept ? ` del departamento ${oldDept}` : '';

  return `${firstNameUserTransfer} ${lastNameUserTransfer}${oldDeptText} ha transferido el ticket a ${firstNameUserAssigned} ${lastNameUserAssigned}${oldDeptText}.`;
};

export const messageTransferDepartment = (
  user: UserDocument,
  ticket: TicketDocument,
  department: SupportDepartmentDocument,
) => {
  const firstName = user.name.split(' ')[0];
  const lastName = user.lastName.split(' ')[0];

  const departmentOldName = ticket?.supportDepartment?.name;

  const oldDeptText = departmentOldName
    ? ` del departamento ${departmentOldName}`
    : '';

  const newDeptText = department?.name
    ? ` al departamento ${department.name}`
    : '';

  return `${firstName} ${lastName}${oldDeptText} ha transferido el ticket${newDeptText}.`;
};
