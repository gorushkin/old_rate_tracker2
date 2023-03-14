import { getRate } from './api';
import { minute } from './constants';

export const updateRates = async () => {
  let rate: string | null = null;
  let date: string;

  const start = async () => {
    rate = await getRate();
    date = new Date().toLocaleString();

    setTimeout(start, minute * 10);
  };

  const getInfo = () => ({ rate, date });

  return { getInfo, start };
};

export const scheduler = updateRates();
