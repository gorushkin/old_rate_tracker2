import { ADMIN_ID } from '../utils/config';
import { User } from '../entity/user';
import { Role, Currency as TypeCurrency } from '../types';
import { currencyService } from './CurrencyService';

const defaultUserCurrencyName: TypeCurrency = 'RUB';

class UserService {
  async getUser(id: number) {
    return await await User.findOne({ where: { id }, relations: ['currencies'] });
  }

  async getUsers() {
    return await User.find();
  }

  async addUser(id: number, username: string) {
    const role: Role = ADMIN_ID === id ? 'admin' : 'user';
    const defaultCurrency = await currencyService.getCurrency(defaultUserCurrencyName);
    const USD = await currencyService.getCurrency('USD');
    const TRY = await currencyService.getCurrency('TRY');
    const user = new User();
    user.username = username;
    user.id = id;
    user.role = role;
    user.currencies = [...(USD ? [USD] : []), ...(TRY ? [TRY] : [])];
    user.firstName = '';
    if (defaultCurrency) {
      user.defaultCurrency = defaultCurrency;
    }
    console.log(user);
    await user.save();
  }
}

export const userService = new UserService();
