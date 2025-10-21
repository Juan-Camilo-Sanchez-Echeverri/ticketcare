import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BusinessContractorsModule } from '@modules/business-contractors/business-contractors.module';

import { BusinessClientsController } from './business-clients.controller';

import { BusinessClientsService } from './business-clients.service';

import { BusinessClientsRepository } from './repositories/business-clients.repository';

import {
  BusinessClient,
  BusinessClientSchema,
} from './schemas/business-client.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BusinessClient.name,
        schema: BusinessClientSchema,
      },
    ]),
    BusinessContractorsModule,
  ],
  controllers: [BusinessClientsController],
  providers: [BusinessClientsService, BusinessClientsRepository],
  exports: [BusinessClientsService],
})
export class BusinessClientsModule {}
