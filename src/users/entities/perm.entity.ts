import { Column, Entity, ManyToMany, PrimaryColumn, Relation } from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class Perm {
  @PrimaryColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Role, (role) => role.perms)
  roles: Relation<Role[]>;
}
