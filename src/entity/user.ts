import {
  Entity,
  Column,
  PrimaryColumn,
  BaseEntity,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { Currency } from './currency';

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

  @Column()
  timeZoneOffset: number;

  @ManyToMany(() => Currency)
  @JoinTable()
  currencies: Currency[];

  @ManyToOne(() => Currency, (defaultCurrency) => defaultCurrency.id)
  defaultCurrency: Currency;

  isAdmin() {
    return this.role === 'admin';
  }
}
