import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Status } from '@common/enums';
import { BaseSchema } from '@common/database';

import type { SupportLevelDocument } from '@modules/support-levels/schemas/support-level.schema';
import type { BusinessContractorDocument } from '@modules/business-contractors/schemas/business-contractor.schema';
import { ConflictException } from '@nestjs/common';

@Schema({
  timestamps: true,
  versionKey: false,
  strict: true,
  strictQuery: true,
})
export class SupportDepartment extends BaseSchema {
  /**
   * Name of the support department.
   */
  @Prop({ required: true, unique: true })
  name: string;

  /**
   * Description of the support department.
   */
  @Prop({ required: true })
  description: string;

  /**
   * Status of the support department.
   */
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

SupportDepartmentSchema.pre('findOneAndDelete', async function (next) {
  const query = this.getFilter() as { _id: string };
  const departmentId = new mongoose.Types.ObjectId(query._id);

  const ticketsModel = this.model.db.collection('tickets');
  const users = this.model.db.collection('users');

  const [ticketCount, userCount] = await Promise.all([
    ticketsModel.countDocuments({ supportDepartment: departmentId }),
    users.countDocuments({
      'details.supportDepartments': { $in: [departmentId] },
    }),
  ]);

  if (ticketCount > 0 || userCount > 0) {
    return next(
      new ConflictException(
        'Cannot delete support department with associated tickets or users.',
      ),
    );
  }

  return next();
});
