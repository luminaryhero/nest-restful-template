import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class TokenEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  sub: number;

  @Column()
  value: string;

  @CreateDateColumn()
  iat: Date;

  exp: Date;

  @Column()
  isActive: boolean;
}
