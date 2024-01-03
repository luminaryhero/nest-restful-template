import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabasesModule } from './databases/databases.module';
import { ConfigurationsModule } from './configurations/configurations.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './commons/transform.interceptor';
import { AllExceptionsFilter } from './commons/all-exception.filter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { RecordsModule } from './records/records.module';
import { LoggerMiddleware } from './records/commmons/logger.middleware';

@Module({
  imports: [
    UsersModule,
    DatabasesModule,
    ConfigurationsModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [config.get('throttler')],
    }),
    RecordsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
