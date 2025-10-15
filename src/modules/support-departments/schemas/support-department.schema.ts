import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Status } from '@common/enums';
import { BaseSchema } from '@common/database';

import type { SupportLevelDocument } from '@modules/support-levels/schemas/support-level.schema';
import type { BusinessContractorDocument } from '@modules/business-contractors/schemas/business-contractor.schema';

@Schema({ timestamps: true })
export class SupportDepartment extends BaseSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ enum: Status, default: Status.ACTIVE })
  status: Status;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'SupportLevel' })
  supportLevels: Pick<SupportLevelDocument, '_id' | 'name'>[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'SupportLevel' })
  defaultLevel: Pick<SupportLevelDocument, '_id' | 'name'>;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'BusinessContractor' })
  businessContractor: Pick<BusinessContractorDocument, '_id' | 'name'>;
}

export type SupportDepartmentDocument = HydratedDocument<SupportDepartment>;
export const SupportDepartmentSchema =
  SchemaFactory.createForClass(SupportDepartment);
