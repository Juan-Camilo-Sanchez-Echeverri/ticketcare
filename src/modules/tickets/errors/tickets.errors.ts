export const TicketErrors = {
  NOT_FOUND: {
    message: 'The ticket does not exist',
  },
  ACTIVITY_NOT_FOUND: {
    message: 'The activity does not exist',
  },
  NO_PERMISSION_TRANSFER_DEPARTMENT: {
    message:
      'You do not have permission to move the ticket to the specified department.',
  },
  TICKET_ALREADY_IN_DEPARTMENT: {
    message: 'The ticket is already in this department.',
  },
  TICKET_ALREADY_IN_LEVEL: {
    message: 'The ticket is already at this level.',
  },
  NO_PERMISSION_TRANSFER_LEVEL: {
    message:
      'You do not have permission to move the ticket to the specified level.',
  },
  LEVEL_NOT_BELONG: {
    message: 'The level does not belong to the ticket department.',
  },
  ACTIVITY_MODIFICATION: {
    message: 'Cannot be changed after 1 hour of shipment',
  },
  DEPARTMENT_MISMATCH: {
    message:
      'The assigned user does not belong to the same department as the ticket.',
  },
  LEVEL_MISMATCH: {
    message: 'The assigned user does not have the same level as the ticket.',
  },
};
