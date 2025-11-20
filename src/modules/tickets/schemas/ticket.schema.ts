import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { BaseSchema } from '@common/database';

import type { SupportLevelDocument } from '@modules/support-levels/schemas/support-level.schema';
import type { BusinessClientDocument } from '@modules/business-clients/schemas/business-client.schema';
import type { BusinessContractorDocument } from '@modules/business-contractors/schemas/business-contractor.schema';
import type { SupportDepartmentDocument } from '@modules/support-departments/schemas/support-department.schema';
import type { UserDocument } from '@modules/users/schemas';

import { PriorityTicket, StatusTicket, TicketSource } from '../enums';

import { Activity, ActivitySchema } from './activity.schema';
import { Evidence, EvidenceSchema } from './evidence.schema';

type UserReference = Pick<
  UserDocument,
  '_id' | 'name' | 'lastName' | 'email' | 'phone'
>;

@Schema({ timestamps: true, versionKey: false })
export class Ticket extends BaseSchema {
  /**
   * Serial number of the ticket
   */
  @Prop()
  serial: string;

  /**
   * Title of the ticket
   */
  @Prop({ required: true })
  title: string;

  /**
   * Description of the ticket
   */
  @Prop({ required: true })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
  assignedUser: UserReference | null;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  requestingUser: UserReference;

  /**
   * Status of the ticket
   */
  @Prop({ enum: StatusTicket, default: StatusTicket.OPEN })
  status: StatusTicket;

  /**
   * Priority set by the user
   */
  @Prop({ enum: PriorityTicket, default: PriorityTicket.LOW })
  priorityUser: PriorityTicket;

  /**
   * Source/origin of the ticket (platform, email, whatsapp)
   */
  @Prop({ enum: TicketSource, default: TicketSource.PLATFORM })
  source: TicketSource;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SupportDepartment',
    default: null,
  })
  supportDepartment: Pick<
    SupportDepartmentDocument,
    '_id' | 'name' | 'supportLevels'
  > | null;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusinessClient',
    default: null,
  })
  businessClient: Pick<BusinessClientDocument, '_id' | 'name'> | null;

  /**
   * Evidence associated with the ticket
   */
  @Prop({ type: EvidenceSchema, _id: false, default: () => ({}) })
  evidence: Evidence;

  @Prop({ type: [ActivitySchema] })
  activity: Activity[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SupportLevel',
    default: null,
  })
  supportLevel: Pick<SupportLevelDocument, '_id' | 'name'> | null;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusinessContractor',
    default: null,
  })
  businessContractor: Pick<BusinessContractorDocument, '_id' | 'name'> | null;

  /**
   * Internal priority set by support staff
   */
  @Prop({ enum: PriorityTicket, default: PriorityTicket.LOW })
  priorityInternal: PriorityTicket;
}

export type TicketDocumentOverride = {
  activity: Types.DocumentArray<Activity>;
};

export type TicketDocument = HydratedDocument<Ticket, TicketDocumentOverride>;

export const TicketSchema = SchemaFactory.createForClass(Ticket);
