import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  private readonly saltOrRounds: string | number;

  constructor(dataSource: DataSource, config: ConfigService) {
    dataSource.subscribers.push(this);
    this.saltOrRounds = config.get('bcrypt.saltOrRounds') || 10;
  }

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    const saltOrRounds = this.saltOrRounds;
    event.entity.password = await bcrypt.hash(
      event.entity.password,
      saltOrRounds,
    );
    console.log(this.saltOrRounds);
  }

  async beforeUpdate(event: UpdateEvent<User>) {
    if (event.entity?.password) {
      const saltOrRounds = this.saltOrRounds;
      event.entity.password = await bcrypt.hash(
        event.entity.password,
        saltOrRounds,
      );
    }
  }
}
