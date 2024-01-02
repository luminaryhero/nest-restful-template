import { Column, Entity, ManyToMany, PrimaryColumn, Relation } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Role {
  @PrimaryColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: Relation<User[]>;
}
