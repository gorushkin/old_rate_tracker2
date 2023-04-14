import { getRates } from '../api';
import { minute } from '../bot/constants';
import { Rates } from './types';

export const updateRates = async () => {
  let date: string;
  let rates = {} as Rates;

  const start = async () => {
    rates = await getRates();
    date = new Date().toLocaleString();

    setTimeout(start, minute * 10);
  };

  const getInfo = () => ({ rates, date });

  return { getInfo, start };
};

export const scheduler = updateRates();
