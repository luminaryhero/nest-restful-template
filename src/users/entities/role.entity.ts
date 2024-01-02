import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { User } from './user.entity';
import { Perm } from './perm.entity';

@Entity()
export class Role {
  @PrimaryColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: Relation<User[]>;

  @ManyToMany(() => Perm, (perm) => perm.roles)
  @JoinTable()
  perms: Relation<Perm[]>;
}
