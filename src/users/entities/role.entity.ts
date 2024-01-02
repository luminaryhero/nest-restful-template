import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from './user.entity';
import { Perm } from './perm.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable()
  users: Relation<User[]>;

  @ManyToMany(() => Perm, (perm) => perm.roles)
  perms: Relation<Perm[]>;
}
