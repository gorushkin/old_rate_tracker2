import axios from 'axios';
import { currencies } from './bot/constants';
import { TypeCurrency, Rates } from './utils/types';

const getApiUrl = (currency: TypeCurrency, baseCurrency: TypeCurrency = 'RUB') =>
  `https://api.coingate.com/v2/rates/merchant/${currency}/${baseCurrency}`;

export const getCurrencyRate = async (currency: TypeCurrency): Promise<string> => {
  try {
    const { data } = await axios(getApiUrl(currency));
    return data;
  } catch (error) {
    return 'null';
  }
};

export const getRates = async () => {
  const promises = currencies.map(async (currency) => {
    const rate = await getCurrencyRate(currency);
    return { rate, currency };
  });

  const resolvedPromises = await Promise.all(promises);

  const result = resolvedPromises.reduce<Rates>(
    (acc, { currency, rate }) => ({ ...acc, [currency]: rate }),
    {} as Rates
  );

  return result;
};
