import { CALL_BACK_DATA } from './constants';
import { Currency } from '../entity/currency';
import { currencyService } from '../services/CurrencyService';
class State {
  private state: Map<number, CALL_BACK_DATA>;
  private currencies: Currency[];

  constructor() {
    this.state = new Map();
    this.currencies = [];
  }

  init = async () => {
    const res = await currencyService.getCurrencies();
    this.currencies = res
  };

  setState = (id: number, mode: CALL_BACK_DATA) => {
    this.state.set(id, mode);
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
