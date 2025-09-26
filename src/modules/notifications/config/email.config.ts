import { envs } from '@configs';

export const emailConfig = {
  smtp: {
    host: 'smtp.gmail.com',
    secure: false,
    auth: {
      user: envs.userNotifications,
      pass: envs.passwordNotifications,
    },
  },
};
