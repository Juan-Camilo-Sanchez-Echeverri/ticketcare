import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument } from 'mongoose';

import { BaseSchema } from '@common/database';

import { Status } from '@common/enums';

import type { BusinessContractorDocument } from '@modules/business-contractors/schemas/business-contractor.schema';

@Schema({
  timestamps: true,
  versionKey: false,
  strict: 'throw',
  strictQuery: 'throw',
})
export class SupportLevel extends BaseSchema {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, enum: Status, default: Status.ACTIVE })
  status: Status;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'BusinessContractor' })
  businessContractor: Pick<BusinessContractorDocument, '_id' | 'name'>;
}

export type SupportLevelDocument = HydratedDocument<SupportLevel>;
export const SupportLevelSchema = SchemaFactory.createForClass(SupportLevel);

SupportLevelSchema.index({ name: 1, businessContractor: 1 }, { unique: true });
