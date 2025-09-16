import { Injectable } from '@nestjs/common';

import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

import { Connection } from 'mongoose';

import paginate from 'mongoose-paginate-v2';

import { ExecModes } from '@common/enums';
import { validateMongo } from '@common/helpers';

import { envs } from './envs';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: envs.dbUrl,
      connectionFactory: (connection: Connection) => {
        connection.set('debug', envs.nodeEnv === ExecModes.LOCAL);
        connection.plugin(paginate);

        connection.plugin((schema) => {
          schema.post('save', validateMongo);
          schema.post('findOneAndUpdate', validateMongo);
          schema.post('updateOne', validateMongo);
        });

        return connection;
      },
    };
  }
}
