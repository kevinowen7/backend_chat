import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService) { }

  createMongooseOptions(): MongooseModuleOptions {
    const mongooseOption = {
      connectionName: 'mongo',
      uri: this.configService.get<string>('MONGODB_URI'),
      user: this.configService.get<string>('MONGODB_USER'),
      pass: this.configService.get<string>('MONGODB_PASS'),
    };

    // MONGODB_DBNAME (env to handle docker dashboard issue)
    const mongodbName = this.configService.get<string>('MONGODB_DBNAME');
    if (mongodbName) mongooseOption['dbName'] = mongodbName;

    return mongooseOption;
  }
}
