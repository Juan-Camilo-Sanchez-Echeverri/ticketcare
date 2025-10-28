import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { BusinessContractorsModule } from '@modules/business-contractors/business-contractors.module';
import { SupportLevelsModule } from '@modules/support-levels/support-levels.module';

import { SupportDepartmentsController } from './support-departments.controller';

import { SupportDepartmentsService } from './support-departments.service';

import { SupportDepartmentsRepository } from './repositories/support-departments.repository';

import {
  SupportDepartment,
  SupportDepartmentSchema,
} from './schemas/support-department.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SupportDepartment.name,
        schema: SupportDepartmentSchema,
      },
    ]),
    BusinessContractorsModule,
    SupportLevelsModule,
  ],
  controllers: [SupportDepartmentsController],
  providers: [SupportDepartmentsService, SupportDepartmentsRepository],
  exports: [SupportDepartmentsService],
})
export class SupportDepartmentsModule {}
