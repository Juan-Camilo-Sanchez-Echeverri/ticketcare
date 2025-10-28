import { BusinessContractorsErrors } from '../errors/business-contractors.errors';

export const BusinessContractorsDeleteExamples = {
  linkedClient: {
    summary: 'Contractor linked to business clients',
    value: BusinessContractorsErrors.CANNOT_DELETE_LINKED_CLIENT,
  },
  linkedDepartment: {
    summary: 'Contractor linked to support departments',
    value: BusinessContractorsErrors.CANNOT_DELETE_LINKED_DEPARTMENT,
  },
  linkedLevel: {
    summary: 'Contractor linked to support levels',
    value: BusinessContractorsErrors.CANNOT_DELETE_LINKED_LEVEL,
  },
  linkedTicket: {
    summary: 'Contractor linked to tickets',
    value: BusinessContractorsErrors.CANNOT_DELETE_LINKED_TICKET,
  },
  linkedUser: {
    summary: 'Contractor linked to users',
    value: BusinessContractorsErrors.CANNOT_DELETE_LINKED_USER,
  },
};
