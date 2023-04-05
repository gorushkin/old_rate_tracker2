import { ADMIN_ID } from './config';
import { User } from './db/entity';
import { Role } from './types';

class DB {
  async getUser(id: number) {
    return await User.findOneBy({ id });
  }

  async getUsers() {
    return await User.find();
  }

  async addUser(id: number, username: string) {
    const role: Role = ADMIN_ID === id ? 'admin' : 'user';
    const user = new User();
    user.username = username;
    user.id = id;
    user.role = role;
    user.firstName = '';
    await user.save();
  }
}

export const db = new DB();
