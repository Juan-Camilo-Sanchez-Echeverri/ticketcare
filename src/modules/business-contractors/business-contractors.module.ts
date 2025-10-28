import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BusinessContractorsController } from './business-contractors.controller';

import { BusinessContractorsService } from './business-contractors.service';

import { BusinessContractorsRepository } from './repositories/business-contractors.repository';

import {
  BusinessContractor,
  BusinessContractorSchema,
} from './schemas/business-contractor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BusinessContractor.name,
        schema: BusinessContractorSchema,
      },
    ]),
  ],
  controllers: [BusinessContractorsController],
  providers: [BusinessContractorsService, BusinessContractorsRepository],
  exports: [BusinessContractorsService],
})
export class BusinessContractorsModule {}
