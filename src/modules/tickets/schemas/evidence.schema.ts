import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { MediaEvidenceDto } from '../dto/media-evidence.dto';

@Schema()
export class Evidence {
  /**
   * URL of the evidence
   */
  @Prop()
  url: string;

  /**
   * User to access the evidence
   */
  @Prop()
  user: string;

  /**
   * Password to access the evidence
   */
  @Prop()
  password: string;

  /**
   * Multimedia files associated with the evidence
   */
  @Prop({ type: [MediaEvidenceDto] })
  multimedia: MediaEvidenceDto[];
}

export const EvidenceSchema = SchemaFactory.createForClass(Evidence);
