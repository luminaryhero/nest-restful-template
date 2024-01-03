import { Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule, utilities } from 'nest-winston';
import { join } from 'path';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

function createDailyRotateTrasnport(level: string, filename: string) {
  return new winston.transports.DailyRotateFile({
    level,
    dirname: 'logs',
    filename: `${filename}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.simple(),
    ),
  });
}

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            utilities.format.nestLike(),
          ),
        }),

        ...(process.env.NODE_ENV === 'production'
          ? [
              createDailyRotateTrasnport('info', 'combined'),
              createDailyRotateTrasnport('warn', 'error'),
            ]
          : []),
      ],
    }),
  ],
  controllers: [],
  providers: [Logger],
  exports: [Logger],
})
export class RecordsModule {}
