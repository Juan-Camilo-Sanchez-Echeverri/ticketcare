import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BusinessContractorsModule } from '@modules/business-contractors/business-contractors.module';

import {
  BusinessClient,
  BusinessClientSchema,
} from './schemas/business-client.schema';

import { BusinessClientsController } from './business-clients.controller';

import { BusinessClientsService } from './business-clients.service';

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
  providers: [BusinessClientsService],
  exports: [BusinessClientsService],
})
export class BusinessClientsModule {}
