import { resolve } from 'node:path';

import { config } from 'dotenv';

import joi from 'joi';

import { ExecModes } from '@common/enums';

const nodeEnv = process.env.NODE_ENV || ExecModes.LOCAL;

const envFile = nodeEnv === ExecModes.PROD ? '.env' : `.env.${nodeEnv}`;

const envPath = resolve(process.cwd(), envFile);

config({ path: envPath });

interface EnvVars {
  PORT: number;
  NODE_ENV: ExecModes;

  DB_URL: string;

  JWT_SECRET: string;
  JWT_EXPIRATION: string;

  USER_NOTIFICATIONS: string;
  PASSWORD_NOTIFICATIONS: string;

  URL_SERVER: string;

  DEFAULT_USER_NAME: string;
  DEFAULT_USER_LAST_NAME: string;
  DEFAULT_USER_EMAIL: string;
  DEFAULT_USER_PHONE: string;
  DEFAULT_USER_PASSWORD: string;

  IMAP_USER: string;
  IMAP_PASSWORD: string;

  META_API_VERSION: string;
  META_PHONE_NUMBER_ID: string;
  META_ACCESS_TOKEN: string;
  META_BASE_URL: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),

    NODE_ENV: joi
      .string()
      .valid(...Object.values(ExecModes))
      .required(),

    DB_URL: joi.string().required(),

    JWT_SECRET: joi.string().required(),
    JWT_EXPIRATION: joi.string().required(),

    USER_NOTIFICATIONS: joi.string().required(),
    PASSWORD_NOTIFICATIONS: joi.string().required(),

    URL_SERVER: joi.string().uri().required(),

    DEFAULT_USER_NAME: joi.string().required(),
    DEFAULT_USER_LAST_NAME: joi.string().required(),
    DEFAULT_USER_EMAIL: joi.string().required(),
    DEFAULT_USER_PHONE: joi.string().required(),
    DEFAULT_USER_PASSWORD: joi.string().required(),

    IMAP_USER: joi.string().required(),
    IMAP_PASSWORD: joi.string().required(),

    META_API_VERSION: joi.string().required(),
    META_PHONE_NUMBER_ID: joi.string().required(),
    META_ACCESS_TOKEN: joi.string().required(),
    META_BASE_URL: joi.string().uri().required(),
  })
  .unknown(true);

const result = envSchema.validate(process.env, { abortEarly: false });
const error = result.error;
const value = result.value as EnvVars;

if (error) throw new Error(`Config validation error: \n ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  nodeEnv: envVars.NODE_ENV,

  dbUrl: envVars.DB_URL,

  jwtSecret: envVars.JWT_SECRET,
  jwtExpiration: envVars.JWT_EXPIRATION,

  userNotifications: envVars.USER_NOTIFICATIONS,
  passwordNotifications: envVars.PASSWORD_NOTIFICATIONS,

  urlServer: envVars.URL_SERVER,

  defaultUserName: envVars.DEFAULT_USER_NAME,
  defaultUserLastName: envVars.DEFAULT_USER_LAST_NAME,
  defaultUserEmail: envVars.DEFAULT_USER_EMAIL,
  defaultUserPhone: envVars.DEFAULT_USER_PHONE,
  defaultUserPassword: envVars.DEFAULT_USER_PASSWORD,

  imapUser: envVars.IMAP_USER,
  imapPassword: envVars.IMAP_PASSWORD,

  metaApiVersion: envVars.META_API_VERSION,
  metaPhoneNumberId: envVars.META_PHONE_NUMBER_ID,
  metaAccessToken: envVars.META_ACCESS_TOKEN,
  metaBaseUrl: envVars.META_BASE_URL,
};
