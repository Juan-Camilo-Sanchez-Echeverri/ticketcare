import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Address {
  @Prop()
  country: string;

  @Prop()
  state: string;

  @Prop()
  city: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
