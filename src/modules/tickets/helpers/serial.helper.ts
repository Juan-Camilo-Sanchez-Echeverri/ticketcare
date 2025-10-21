import type { PaginateModel } from 'mongoose';

import { TicketDocument } from '../schemas';

export async function getTicketSerial(
  ticketModel: PaginateModel<TicketDocument>,
  contractorId: string,
): Promise<string> {
  const count = await ticketModel.countDocuments({
    businessContractor: contractorId,
  });

  const serial = (count + 1).toString().padStart(2, '0');
  return serial;
}
