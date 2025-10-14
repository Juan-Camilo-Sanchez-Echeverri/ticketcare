import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { BusinessDocumentType, Status, TypeActivity } from '@common/enums';

import { Address, AddressSchema } from '@common/schemas';

@Schema({ timestamps: true })
export class BusinessContractor {
  @Prop()
  name: string;

  @Prop({ required: true, enum: BusinessDocumentType })
  documentType: BusinessDocumentType;

  @Prop()
  document: string;

  @Prop()
  phone: string;

  @Prop({ required: true, enum: Status, default: Status.ACTIVE })
  status: Status;

  @Prop()
  email: string;

  @Prop({ enum: TypeActivity })
  typeActivity: TypeActivity;

  @Prop({ type: AddressSchema, _id: false })
  address: Address;
}

export type BusinessContractorDocument = HydratedDocument<BusinessContractor>;

export const BusinessContractorSchema =
  SchemaFactory.createForClass(BusinessContractor);
