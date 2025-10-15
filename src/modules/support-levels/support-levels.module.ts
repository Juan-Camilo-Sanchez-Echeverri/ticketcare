import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { BusinessContractorsModule } from '@modules/business-contractors/business-contractors.module';

import { SupportLevelsController } from './support-levels.controller';

import { SupportLevelsService } from './support-levels.service';

import {
  SupportLevel,
  SupportLevelSchema,
} from './schemas/support-level.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SupportLevel.name,
        schema: SupportLevelSchema,
      },
    ]),
    BusinessContractorsModule,
  ],
  controllers: [SupportLevelsController],
  providers: [SupportLevelsService],
  exports: [SupportLevelsService],
})
export class SupportLevelsModule {}
