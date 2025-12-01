import { envs } from '@configs';

export const emailConfig = {
  smtp: {
    host: 'smtp.gmail.com',
    secure: true,
    auth: {
      user: envs.userNotifications,
      pass: envs.passwordNotifications,
    },
  },
};
