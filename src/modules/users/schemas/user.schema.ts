import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Status, UserRole } from '@common/enums';

import { BaseSchema } from '@common/database';

import { Details, DetailsSchema } from './details.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({
  versionKey: false,
  timestamps: true,
  strict: 'throw',
  strictQuery: 'throw',
})
export class User extends BaseSchema {
  @Prop({ trim: true })
  name: string;

  @Prop({ trim: true })
  lastName: string;

  @Prop({ unique: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ unique: true, trim: true })
  phone: string;

  @Prop({ enum: Status, default: Status.ACTIVE, type: String })
  status: Status;

  @Prop()
  role: UserRole;

  @Prop({ type: DetailsSchema, _id: false })
  details: Details;

  @Prop({ default: false })
  online: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  modifiedBy: Pick<UserDocument, '_id' | 'name' | 'lastName' | 'email'>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});
