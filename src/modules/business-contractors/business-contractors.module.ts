import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  BusinessContractor,
  BusinessContractorSchema,
} from './schemas/business-contractor.schema';

import { BusinessContractorsController } from './business-contractors.controller';

import { BusinessContractorsService } from './business-contractors.service';

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
  providers: [BusinessContractorsService],
  exports: [BusinessContractorsService],
})
export class BusinessContractorsModule {}
