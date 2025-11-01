import { ImapFlowOptions } from 'imapflow';

import { envs } from './envs';

export const imapConfig: ImapFlowOptions = {
  auth: {
    user: envs.imapUser,
    pass: envs.imapPassword,
  },
  host: 'imap.gmail.com',
  port: 993,
  secure: true,
  logger: false,
};
