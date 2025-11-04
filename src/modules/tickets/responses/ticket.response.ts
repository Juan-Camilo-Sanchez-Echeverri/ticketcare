import { OmitType, PickType } from '@nestjs/swagger';

import { BusinessClientResponse } from '@modules/business-clients/responses/business-clients.response';
import { BusinessContractorResponse } from '@modules/business-contractors/responses/business-contractor.response';
import { SupportDepartmentResponse } from '@modules/support-departments/responses/support-department.response';
import { UserResponse } from '@modules/users/responses/user.response';

import { Ticket } from '../schemas';

class AssignedUserTicketResponse extends PickType(UserResponse, [
  '_id',
  'name',
  'lastName',
  'email',
  'phone',
] as const) {}

class RequestingUserTicketResponse extends PickType(UserResponse, [
  '_id',
  'name',
  'lastName',
  'email',
  'phone',
] as const) {}

class SupportDepartmentTicketResponse extends PickType(
  SupportDepartmentResponse,
  ['_id', 'name', 'supportLevels'] as const,
) {}

class BusinessClientTicketResponse extends PickType(BusinessClientResponse, [
  '_id',
  'name',
] as const) {}

class SupportLevelTicketResponse extends PickType(SupportDepartmentResponse, [
  '_id',
  'name',
]) {}

class BusinessContractorTicketResponse extends PickType(
  BusinessContractorResponse,
  ['_id', 'name'] as const,
) {}

export class TicketResponse extends OmitType(Ticket, [
  'assignedUser',
  'requestingUser',
  'supportDepartment',
  'businessClient',
  'supportLevel',
  'businessContractor',
]) {
  /**
   * Identifier for the ticket.
   */
  _id: string;

  /**
   * User assigned to the ticket.
   */
  assignedUser: AssignedUserTicketResponse;

  /**
   * User who requested the ticket.
   */
  requestingUser: RequestingUserTicketResponse;

  /**
   * Support department associated with the ticket.
   */
  supportDepartment: SupportDepartmentTicketResponse;

  /**
   * Business client associated with the ticket.
   */
  businessClient: BusinessClientTicketResponse;

  /**
   * Support level associated with the ticket.
   */
  supportLevel: SupportLevelTicketResponse;

  /**
   * Business contractor associated with the ticket.
   */
  businessContractor: BusinessContractorTicketResponse;
}
