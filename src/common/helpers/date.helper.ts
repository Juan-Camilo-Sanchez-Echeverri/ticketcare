import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export class DateHelper {
  static checkExpiration(expiresIn: Date): boolean {
    const now = dayjs().utc();
    const expire = dayjs(expiresIn).utc();

    return now.isAfter(expire);
  }

  static isAvailable(startDate: Date, endDate: Date): boolean {
    const now = dayjs.utc();
    const start = dayjs.utc(startDate);
    const end = dayjs.utc(endDate);

    const isBefore = now.isBefore(end);
    const isAfter = now.isAfter(start);

    return isAfter && isBefore;
  }

  static hasStarted(startDate: Date): boolean {
    const now = dayjs.utc();
    const start = dayjs.utc(startDate);
    return now.isAfter(start);
  }

  static hasFinished(endDate: Date): boolean {
    const now = dayjs.utc();
    const end = dayjs.utc(endDate);
    return now.isAfter(end);
  }
}
