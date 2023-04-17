import { getRates } from '../api';
import { minute } from '../bot/constants';
import { Rates } from './types';

class RatesUpdater {
  #requestDate: string;
  #ratesData: Rates;

  constructor() {
    this.#ratesData = {} as Rates;
  }

  async start() {
    await this.#updateRates();
  }

  async #updateRates() {
    this.#ratesData = await getRates();
    this.#requestDate = new Date().toISOString();
    setTimeout(this.#updateRates.bind(this), minute * 10);
  }

  async getRates() {
    return { rates: this.#ratesData, date: this.#requestDate };
  }
}

export const updater = new RatesUpdater();
