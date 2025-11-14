import axios from 'axios';

import { envs } from '@configs';

const baseUrl = `${envs.metaBaseUrl}/${envs.metaApiVersion}/${envs.metaPhoneNumberId}/messages`;

export const whatsAppApi = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${envs.metaAccessToken}`,
  },
});
