import { exec } from 'child_process';

import { select } from '@inquirer/prompts';
// import chalk from 'chalk';

enum EnvTypeEnum {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}
enum OperationTypeENUM {
  GENERATE = 'generate',
  CREATE = 'create',
  RUN = 'run',
  REVERT = 'revert',
}
async function run() {
  const type = await select({
    message: '请选择操作类型',
    choices: [
      {
        name: '创建迁移文件',
        value: OperationTypeENUM.CREATE,
      },
      {
        name: '生成迁移文件',
        value: OperationTypeENUM.GENERATE,
      },
      {
        name: '执行迁移',
        value: OperationTypeENUM.RUN,
      },
      {
        name: '回滚',
        value: OperationTypeENUM.REVERT,
      },
    ],
  });
  const env = await select({
    message: '请选择迁移环境',
    choices: [
      {
        name: '开发环境',
        value: EnvTypeEnum.DEVELOPMENT,
      },
      {
        name: '线上环境',
        value: EnvTypeEnum.PRODUCTION,
      },
    ],
  });

  let migrationCmd = '';

  switch (type) {
    case OperationTypeENUM.CREATE:
      migrationCmd = `cross-env NODE_ENV=${env} typeorm-ts-node-esm migration:create ./src/databases/migrations/${env}/v1`;
      break;
    case OperationTypeENUM.GENERATE:
      migrationCmd = `npm run build && cross-env NODE_ENV=${env} typeorm-ts-node-esm migration:generate ./src/databases/migrations/${env}/v1 -d ./src/databases/data-source.ts`;
      break;
    case OperationTypeENUM.RUN:
      migrationCmd = `npm run build && cross-env NODE_ENV=${env} typeorm-ts-node-esm migration:run -d ./src/databases/data-source.ts`;
      break;
    case OperationTypeENUM.REVERT:
      migrationCmd = `npm run build && cross-env NODE_ENV=${env} typeorm-ts-node-esm migration:revert -d ./src/databases/data-source.ts`;
      break;
    default:
      console.warn('未知的操作类型');
      return;
  }

  exec(`${migrationCmd}`, (err, stdout, stderr) => {
    if (err) {
      console.warn(
        `No changes in database schema were found - cannot generate a migration. To create a new empty migration use "typeorm migration:create" command`,
      );
      console.error(err.message);
      process.exit(1);
    }
    if (stderr) {
      console.warn(stderr);
      process.exit(0);
    }
    console.log(stdout);
  });
}

run();
