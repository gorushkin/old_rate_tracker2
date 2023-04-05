import { DataSource } from 'typeorm';
import { User } from './entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  synchronize: false ,
  logging: true,
  entities: [User],
  subscribers: [],
  migrations: ['./src/db/migrations/**/*.ts'],
});
