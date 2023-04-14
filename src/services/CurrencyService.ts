import { Currency } from '../entity/currency';
import { TypeCurrency as TypeCurrency } from '../utils/types';

const currencies: TypeCurrency[] = ['EUR', 'NZD', 'RUB', 'TRY', 'USD'];

class CurrencyService {
  async getCurrencies() {
    return await Currency.find();
  }

  async init() {
    const existedCurrencies = await this.getCurrencies();
    if (existedCurrencies.length) return;
    await Promise.all(
      currencies.map(async (name) => {
        const currency = new Currency();
        currency.name = name;
        await currency.save();
      })
    );
  }

  async getCurrency(name: TypeCurrency) {
    return await Currency.findOneBy({ name });
  }
}

export const currencyService = new CurrencyService();
