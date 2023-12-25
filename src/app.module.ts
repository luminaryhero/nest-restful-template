import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabasesModule } from './databases/databases.module';

@Module({
  imports: [UsersModule, DatabasesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
