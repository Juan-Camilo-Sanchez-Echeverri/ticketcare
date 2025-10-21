import { BadRequestException } from '@nestjs/common';
import { ACTIVITY_MODIFICATION_ERROR } from '../constants';

export const validateHourDifference = (createdAt: Date): void => {
  const now = new Date();
  const diff = now.getTime() - createdAt.getTime();
  const diffHours = diff / (1000 * 60 * 60);
  if (diffHours > 1) {
    throw new BadRequestException(ACTIVITY_MODIFICATION_ERROR);
  }
};
