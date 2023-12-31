import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { TokenEntity } from '../entities/token.entity';
import { ConfigService } from '@nestjs/config';

@EventSubscriber()
export class TokenSubscriber implements EntitySubscriberInterface<TokenEntity> {
  private readonly expiresIn: string | number;

  constructor(dataSource: DataSource, config: ConfigService) {
    dataSource.subscribers.push(this);
    this.expiresIn = config.get('jwt.signOptions.expiresIn');
  }

  listenTo() {
    return TokenEntity;
  }

  async beforeInsert(event: InsertEvent<TokenEntity>) {
    const sub = event.entity.sub;

    event.manager.update(TokenEntity, sub, { isActive: false });

    // const iat = event.entity.iat;
    // if (typeof this.expiresIn === 'number') {
    //   event.entity.exp = new Date(iat.getTime() + this.expiresIn);
    //   return;
    // }

    // const value = +this.expiresIn.slice(0, -1);
    // const unit = this.expiresIn.slice(-1);

    // switch (unit) {
    //   case 's':
    //     event.entity.exp = new Date(value * 1000);
    //     break;
    //   case 'm':
    //     event.entity.exp = new Date(value * 1000 * 60);
    //     break;
    //   case 'h':
    //     event.entity.exp = new Date(value * 1000 * 60 * 60);
    //     break;
    //   case 'd':
    //     event.entity.exp = new Date(value * 1000 * 60 * 60 * 24);
    //     break;
    //   default:
    //     break;
    // }
  }
}
