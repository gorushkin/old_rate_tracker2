import { ADMIN_ID } from '../utils/config';
import { User } from '../entity/user';
import { Role, TypeCurrency as TypeCurrency } from '../utils/types';
import { currencyService } from './CurrencyService';
import { Currency } from '../entity/currency';

const defaultUserCurrencyName: TypeCurrency = 'RUB';

const defaultTimeZoneOffset = '+00:00';

class UserService {
  async getUser(id: number) {
    return await await User.findOne({
      where: { id },
      relations: ['currencies', 'defaultCurrency'],
    });
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
    user.timeZoneOffset = defaultTimeZoneOffset;
    if (defaultCurrency) {
      user.defaultCurrency = defaultCurrency;
    }
    await user.save();
  }

  async forceAddUser(id: number, username: string) {
    const user = await this.getUser(id);
    if (user) return user;
    await this.addUser(id, username);
    return await this.getUser(id);
  }

  async addCurrency(currency: Currency, user: User) {
    user.currencies = [...user.currencies, currency];
    user.save();
    return user;
  }

  async removeCurrency(currency: Currency, user: User) {
    user.currencies = user.currencies.filter((item) => item.id !== currency.id);
    user.save();
    return user;
  }

  async updateUserCurrencies(currency: Currency, id: number) {
    const user = await this.getUser(id);
    if (!user) return;
    const isCurrencyExistInUserList = !!user.currencies.find(
      (userCurrency) => userCurrency.id === currency.id
    );
    const action = isCurrencyExistInUserList ? this.removeCurrency : this.addCurrency;
    return await action(currency, user);
  }

  async updateUserTimeZoneOffset(id: number, timeZoneOffset: string) {
    await User.update({ id }, { timeZoneOffset });
  }
}

export const userService = new UserService();
