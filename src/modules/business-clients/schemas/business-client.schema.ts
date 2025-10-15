import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { BusinessContractorDocument } from '@modules/business-contractors/schemas/business-contractor.schema';

import { AddressSchema, Address } from '@common/schemas';
import { BusinessDocumentType, Status, TypeActivity } from '@common/enums';

@Schema({ timestamps: true })
export class BusinessClient {
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

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'BusinessContractor',
    autopopulate: true,
  })
  businessContractors: BusinessContractorDocument[];

  @Prop({ enum: TypeActivity })
  typeActivity: TypeActivity;

  @Prop()
  logo?: string;

  @Prop({ type: AddressSchema, _id: false })
  address: Address;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  modifiedBy: mongoose.Types.ObjectId;
}

export type BusinessClientDocument = HydratedDocument<BusinessClient>;
export const BusinessClientSchema =
  SchemaFactory.createForClass(BusinessClient);
