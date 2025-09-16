import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Status, UserRole } from '@common/enums';

import { BaseSchema } from '@common/database';

export type UserDocument = HydratedDocument<User>;

@Schema({
  versionKey: false,
  timestamps: true,
  strict: 'throw',
  strictQuery: 'throw',
})
export class User extends BaseSchema {
  @Prop({ trim: true })
  firstName: string;

  @Prop({ trim: true })
  lastName: string;

  @Prop({ unique: true, trim: true })
  email: string;

  @Prop({ unique: true, trim: true })
  phone: string;

  @Prop({ enum: Status, default: Status.ACTIVE, type: String })
  status: Status;

  @Prop({ enum: UserRole, type: String })
  roles: UserRole[];

  @Prop({ default: false })
  online: boolean;

  @Prop({ type: Date })
  lastLogin: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  createdBy: Pick<UserDocument, '_id' | 'firstName' | 'lastName' | 'email'>;
}

export const UserSchema = SchemaFactory.createForClass(User);
