import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, Unique, OneToMany } from 'typeorm';
import { User } from './user';

@Entity()
@Unique(['name'])
export class Currency extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => User, (user) => user.defaultCurrency)
  users: User[];
}
