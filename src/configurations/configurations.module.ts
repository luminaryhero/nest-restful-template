import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import * as Joi from 'joi';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () =>
          yaml.load(
            readFileSync(
              join(
                __dirname,
                process.env.NODE_ENV === 'production'
                  ? 'config.prod.yaml'
                  : 'config.yaml',
              ),
              'utf8',
            ),
          ) as Record<string, any>,
      ],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        http: Joi.object({
          host: Joi.string(),
          port: Joi.number(),
        }),
        db: Joi.object({
          type: Joi.string().valid('mysql'),
          host: Joi.string(),
          port: Joi.number(),
          username: Joi.string(),
          password: Joi.string(),
          database: Joi.string(),
          autoLoadEntities: Joi.bool().valid(true),
          synchronize: Joi.bool(),
        }),
        jwt: Joi.object({
          token: Joi.object({
            secret: Joi.string(),
            signOptions: Joi.object({
              expiresIn: Joi.string(),
            }),
          }),
          refreshToken: Joi.object({
            secret: Joi.string(),
            expiresIn: Joi.string(),
          }),
        }),
        bcrypt: Joi.object({
          saltOrRounds: Joi.valid(Joi.number(), Joi.string()),
        }),
        throttler: Joi.object({
          ttl: Joi.number(),
          limit: Joi.number(),
        }),
      }),
    }),
  ],
})
export class ConfigurationsModule {}
