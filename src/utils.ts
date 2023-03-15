import { getRates } from './api';
import { minute } from './constants';
import { Rates } from './types';

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

const logVault = () => {
  const logs: string[] = [];

  const addLog = ({ username, action }: { username?: string; action: string }) => {
    const currentDate = new Date();
    const hh = currentDate.getHours();
    const mm = currentDate.getMinutes();
    const log = `${logs.length + 1} - [${hh}:${mm}] - ${username || 'null'} - ${action}`;
    logs.push(log);
  };

  const getLogs = () => logs.join('\n');

  return { addLog, getLogs };
};

export const logger = logVault();
