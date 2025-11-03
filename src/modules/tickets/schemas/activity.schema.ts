import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { BaseSchema } from '@common/database';

import type { UserDocument } from '@modules/users/schemas';

import { TypeContent } from '../enums';

@Schema()
export class Content {
  /**
   * Type of the content
   */
  @Prop({ enum: TypeContent })
  type: TypeContent;

  /**
   * Message of the content
   */
  @Prop()
  message: string;

  /**
   * URLs associated with the content
   */
  @Prop({ default: [] })
  urls: string[];
}

export const ContentSchema = SchemaFactory.createForClass(Content);

@Schema({ timestamps: true })
export class Activity extends BaseSchema {
  /**
   * Content of the activity
   */
  @Prop({ type: ContentSchema, _id: false })
  content: Content;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: Pick<UserDocument, 'id' | 'name' | 'lastName' | 'phone' | 'email'>;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
