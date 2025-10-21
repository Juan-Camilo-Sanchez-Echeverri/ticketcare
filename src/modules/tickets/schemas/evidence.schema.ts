import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { MediaEvidenceDto } from '../dto/media-evidence.dto';

@Schema()
export class Evidence {
  @Prop()
  url: string;

  @Prop()
  user: string;

  @Prop()
  password: string;

  @Prop({ type: [MediaEvidenceDto] })
  multimedia: MediaEvidenceDto[];
}

export const EvidenceSchema = SchemaFactory.createForClass(Evidence);
