import { DataSource } from 'typeorm';
import { Currency } from '../entity/currency';
import { User } from '../entity/user';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  synchronize: false ,
  logging: false,
  entities: [User, Currency],
  subscribers: [],
  migrations: ['./migrations/**/*.ts'],
});
