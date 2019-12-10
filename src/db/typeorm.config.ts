import { TypeOrmModuleOptions } from "@nestjs/typeorm";
// import {
//   TYPEORM_HOST,
//   TYPEORM_PASSWORD,
//   TYPEORM_DATABASE,
//   TYPEORM_USERNAME,
// } from "src/constants/constants";

import * as config from "config";

const dbConfig = config.get("db");

const type = process.env.RDS_type || dbConfig.type;
const databaseName = process.env.RDS_databaseName || dbConfig.databaseName;
const synchronize = process.env.RDS_synchronize || dbConfig.synchronize;
const username = process.env.RDS_username || dbConfig.username;
const password = process.env.RDS_password || dbConfig.password;
const host = process.env.RDS_host || dbConfig.host;
const port = process.env.RDS_port || dbConfig.port;

export const typeormConfig: TypeOrmModuleOptions = {
  type,
  host,
  port, // Default for postgress
  username,
  password,
  database: databaseName,
  entities: [__dirname + "/../**/*.entity.**"], // all files ending in entity.ts or entiry.js
  synchronize, // Not Recomended to be true for Production
  // dropSchema: true,
};
