import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

import { BaseSchema } from '@common/database';

import { Status } from '@common/enums';

@Schema({
  timestamps: true,
  versionKey: false,
  strict: 'throw',
  strictQuery: 'throw',
})
export class SupportLevel extends BaseSchema {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, enum: Status, default: Status.ACTIVE })
  status: Status;
}

export type SupportLevelDocument = HydratedDocument<SupportLevel>;
export const SupportLevelSchema = SchemaFactory.createForClass(SupportLevel);

SupportLevelSchema.index({ name: 1, businessContractor: 1 }, { unique: true });
