import { ConflictException } from '@nestjs/common';

import { Connection, Types } from 'mongoose';

import { BusinessContractorsErrors } from '../errors/business-contractors.errors';

export const businessContractorDeleteValidation = async (
  contractorId: string,
  db: Connection,
): Promise<void> => {
  const contractorObjectId = new Types.ObjectId(contractorId);

  const clientsModel = db.collection('businessclients');
  const departmentsModel = db.collection('supportdepartments');
  const levelsModel = db.collection('supportlevels');
  const ticketsModel = db.collection('tickets');
  const usersModel = db.collection('users');

  const [
    linkedDepartment,
    linkedClient,
    linkedLevel,
    linkedTicket,
    linkedUser,
  ] = await Promise.all([
    departmentsModel.countDocuments({ businessContractor: contractorObjectId }),

    clientsModel.countDocuments({
      businessContractors: { $in: [contractorObjectId] },
    }),

    levelsModel.countDocuments({ businessContractor: contractorObjectId }),

    ticketsModel.countDocuments({ businessContractor: contractorObjectId }),

    usersModel.countDocuments({
      'details.businessContractors': { $in: [contractorObjectId] },
    }),
  ]);

  if (linkedClient > 0) {
    throw new ConflictException(
      BusinessContractorsErrors.CANNOT_DELETE_LINKED_CLIENT,
    );
  }

  if (linkedDepartment > 0) {
    throw new ConflictException(
      BusinessContractorsErrors.CANNOT_DELETE_LINKED_DEPARTMENT,
    );
  }

  if (linkedLevel > 0) {
    throw new ConflictException(
      BusinessContractorsErrors.CANNOT_DELETE_LINKED_LEVEL,
    );
  }

  if (linkedTicket > 0) {
    throw new ConflictException(
      BusinessContractorsErrors.CANNOT_DELETE_LINKED_TICKET,
    );
  }

  if (linkedUser > 0) {
    throw new ConflictException(
      BusinessContractorsErrors.CANNOT_DELETE_LINKED_USER,
    );
  }
};
