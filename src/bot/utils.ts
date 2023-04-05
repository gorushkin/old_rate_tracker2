import { getRates } from './api';
import { minute } from './constants';
import { Currency, Rates } from '../types';
import { User } from '../entity/user';

export const syncRate = () => {
  let lastUpdateTime = 0;
  let rates: Rates;

  return async () => {
    const currentTime = Date.now();
    const shouldUpdate = currentTime - lastUpdateTime >= minute * 10;
    if (shouldUpdate) {
      rates = await getRates();
      lastUpdateTime = currentTime;
    }

    const formattedLastUpdateTime = new Date(lastUpdateTime).toLocaleString();

    return { rates, date: formattedLastUpdateTime };
  };
};

export const getRate = syncRate();

export const convertRatesToString = (data: Rates, date: string) => {
  const formattedRates = Object.entries(data)
    .map(([currency, rate]) => `${currency} - ${rate}`)
    .join('\n');

  return `${date}\n\n${formattedRates || 'we are fetching the data'}`;
};

export const getUserRates = (rates: Rates, user: User | null) => {
  if (!user) return rates;
  return user.currencies.reduce<Rates>((acc, item) => {
    const name = item.name as Currency;
    return { ...acc, ...(!!rates[name] && { [name]: rates[name] }) };
  }, {} as Rates);
};
