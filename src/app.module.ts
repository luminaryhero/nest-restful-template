import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabasesModule } from './databases/databases.module';
import { ConfigurationsModule } from './configurations/configurations.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './commons/transform.interceptor';
import { AllExceptionsFilter } from './commons/all-exception.filter';

@Module({
  imports: [UsersModule, DatabasesModule, ConfigurationsModule],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
