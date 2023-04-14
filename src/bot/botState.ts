import { CALL_BACK_DATA } from './constants';
import { Currency } from '../entity/currency';
import { currencyService } from '../services/CurrencyService';
import { User } from '../entity/user';

export type UserDTO = { user: User; mode: CALL_BACK_DATA };

class State {
  private state: Map<number, UserDTO>;
  private currencies: Currency[];

  constructor() {
    this.state = new Map();
    this.currencies = [];
  }

  init = async () => {
    const res = await currencyService.getCurrencies();
    this.currencies = res;
  };

  setState = (id: number, userDto: UserDTO) => {
    this.state.set(id, userDto);
  };

  getState = (id: number) => {
    return this.state.get(id);
  };

  resetState = (id: number) => {
    this.state.delete(id);
  };

  getCurrencies = async () => {
    if (!this.currencies.length) await this.init();
    return this.currencies;
  };
}

export const state = new State();
