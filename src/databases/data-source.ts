import { DataSource, DataSourceOptions } from 'typeorm';
import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';

const entities = [`${process.cwd()}/dist/**/entities/*.entity{.ts,.js}`];
const migrations = [
  `${process.cwd()}/src/databases/migrations/${
    process.env.NODE_ENV
  }/*{.ts,.js}`,
];

const {
  db: { type, database, host, port, username, password },
} = yaml.load(
  readFileSync(
    join(
      `${process.cwd()}/src/configurations`,
      process.env.NODE_ENV === 'production'
        ? 'config.prod.yaml'
        : 'config.yaml',
    ),
    'utf8',
  ),
) as Record<string, any>;

export default new DataSource({
  type,
  database,
  host,
  port,
  username,
  password,
  entities,
  migrations,
  synchronize: false,
} as DataSourceOptions);
