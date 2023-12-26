import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabasesModule } from './databases/databases.module';
import { ConfigurationsModule } from './configurations/configurations.module';

@Module({
  imports: [UsersModule, DatabasesModule, ConfigurationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
