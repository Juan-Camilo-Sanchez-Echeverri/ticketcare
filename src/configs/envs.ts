import { resolve } from 'path';

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
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    NODE_ENV: joi
      .string()
      .valid(...Object.values(ExecModes))
      .default(ExecModes.LOCAL),
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
};
