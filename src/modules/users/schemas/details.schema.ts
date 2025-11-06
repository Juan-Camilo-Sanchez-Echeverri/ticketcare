import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { SupportDepartmentDocument } from '@modules/support-departments/schemas/support-department.schema';
import { SupportLevelDocument } from '@modules/support-levels/schemas/support-level.schema';
import { BusinessContractorDocument } from '@modules/business-contractors/schemas/business-contractor.schema';
import { BusinessClientDocument } from '@modules/business-clients/schemas/business-client.schema';

export type DetailsDocument = HydratedDocument<Details>;

@Schema()
export class Details {
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'SupportDepartment',
    default: [],
  })
  supportDepartments: Pick<SupportDepartmentDocument, '_id' | 'name'>[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'SupportLevel',
    default: [],
  })
  supportLevels: Pick<SupportLevelDocument, '_id' | 'name'>[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'BusinessContractor',
    default: [],
  })
  businessContractors: Pick<BusinessContractorDocument, '_id' | 'name'>[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'BusinessClient',
    default: [],
  })
  businessClients: Pick<
    BusinessClientDocument,
    '_id' | 'name' | 'businessContractors'
  >[];
}

export const DetailsSchema = SchemaFactory.createForClass(Details);
