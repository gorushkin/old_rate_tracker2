import { getRates } from './api';
import { minute } from './constants';
import { Rates } from './types';

export const updateRates = async () => {
  let date: string;
  let rates: Rates;

  const start = async () => {
    rates = await getRates();
    date = new Date().toLocaleString();

    setTimeout(start, minute * 10);
  };

  const getInfo = () => ({ rates, date });

  return { getInfo, start };
};

export const scheduler = updateRates();
