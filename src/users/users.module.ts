import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserSubscriber } from './subscribers/user.subscriber';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './commons/auth.guard';
import { RolesGuard } from './commons/roles.guard';
import { Role } from './entities/role.entity';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PermsController } from './perms.controller';
import { PermsService } from './perms.service';
import { Perm } from './entities/perm.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Perm]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        ...config.get('jwt'),
      }),
    }),
  ],
  controllers: [UsersController, RolesController, PermsController],
  providers: [
    UsersService,
    UserSubscriber,
    RolesService,
    PermsService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class UsersModule {}
