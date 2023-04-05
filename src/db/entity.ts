import { Entity, Column, PrimaryColumn, BaseEntity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  firstName?: string;

  @Column()
  username: string;

  @Column()
  role: string;

  isAdmin() {
    return this.role === 'admin';
  }
}
