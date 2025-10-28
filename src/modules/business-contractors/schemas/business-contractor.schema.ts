import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { BusinessDocumentType, Status, TypeActivity } from '@common/enums';

import { Address, AddressSchema } from '@common/schemas';

import { BaseSchema } from '@common/database';

import { businessContractorDeleteValidation } from '../helpers';

@Schema({
  timestamps: true,
  versionKey: false,
  strict: true,
  strictQuery: true,
})
export class BusinessContractor extends BaseSchema {
  /**
   * Name of the business contractor.
   */
  @Prop({ required: true, unique: true })
  name: string;

  /**
   * Type of document of the business contractor.
   */
  @Prop({ required: true, enum: BusinessDocumentType })
  documentType: BusinessDocumentType;

  /**
   * Document number of the business contractor.
   */
  @Prop({ required: true, unique: true })
  document: string;

  /**
   * Phone number of the business contractor.
   */
  @Prop()
  phone: string;

  /**
   * Status of the business contractor.
   */
  @Prop({ required: true, enum: Status, default: Status.ACTIVE })
  status: Status;

  /**
   * Email of the business contractor.
   */
  @Prop({ required: true, unique: true })
  email: string;

  /**
   * Type of activity of the business contractor.
   */
  @Prop({ enum: TypeActivity })
  typeActivity: TypeActivity;

  /**
   * Address of the business contractor.
   */
  @Prop({ type: AddressSchema, _id: false })
  address: Address;
}

export type BusinessContractorDocument = HydratedDocument<BusinessContractor>;

export const BusinessContractorSchema =
  SchemaFactory.createForClass(BusinessContractor);

BusinessContractorSchema.pre('findOneAndDelete', async function (next) {
  const query = this.getFilter() as { _id: string };

  try {
    await businessContractorDeleteValidation(query._id, this.model.db);
    return next();
  } catch (error) {
    return next(error as Error);
  }
});
