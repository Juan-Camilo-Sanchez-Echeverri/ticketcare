import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { AddressSchema, Address } from '@common/schemas';
import { BaseSchema } from '@common/database';
import { BusinessDocumentType, TypeActivity } from '@common/enums';

import { BusinessContractorDocument } from '@modules/business-contractors/schemas/business-contractor.schema';
import { ConflictException } from '@nestjs/common';

@Schema({
  timestamps: true,
  versionKey: false,
  strict: 'throw',
  strictQuery: 'throw',
})
export class BusinessClient extends BaseSchema {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ required: true, enum: BusinessDocumentType })
  documentType: BusinessDocumentType;

  @Prop({ required: true })
  document: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'BusinessContractor',
  })
  businessContractors: Pick<BusinessContractorDocument, '_id' | 'name'>[];

  @Prop({ enum: TypeActivity })
  typeActivity: TypeActivity;

  @Prop({ type: AddressSchema, _id: false })
  address: Address;
}

export type BusinessClientDocument = HydratedDocument<BusinessClient>;

export const BusinessClientSchema =
  SchemaFactory.createForClass(BusinessClient);

BusinessClientSchema.pre('findOneAndDelete', async function (next) {
  const query = this.getFilter() as { _id: string };
  const clientId = new Types.ObjectId(query._id);

  const usersModel = this.model.db.collection('users');
  const ticketsModel = this.model.db.collection('tickets');

  const [userCount, ticketCount] = await Promise.all([
    usersModel.countDocuments({
      'details.businessClients': { $in: [clientId] },
    }),
    ticketsModel.countDocuments({ businessClient: clientId }),
  ]);

  if (userCount > 0 || ticketCount > 0) {
    return next(
      new ConflictException('Cannot delete business client with relations'),
    );
  }

  next();
});
