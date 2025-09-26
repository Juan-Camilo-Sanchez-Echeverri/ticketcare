import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { EmailRequestService } from './email-request.service';

import { EmailRequestRepository } from './repositories/email-request.repository';

import {
  EmailRequest,
  EmailRequestSchema,
} from './schemas/email-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailRequest.name, schema: EmailRequestSchema },
    ]),
  ],
  providers: [EmailRequestService, EmailRequestRepository],
  exports: [EmailRequestService],
})
export class EmailRequestModule {}
