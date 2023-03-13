import { getRate } from './api';
import { minute } from './constants';

export const syncRate = () => {
  let rate: string | null = null;
  let lastUpdateTime = 0;

  return async () => {
    const currentTime = Date.now();
    const shouldUpdate = currentTime - lastUpdateTime >= minute * 10;
    if (shouldUpdate) {
      rate = await getRate();
      lastUpdateTime = currentTime;
    }

    const formattedLastUpdateTime = new Date(lastUpdateTime).toLocaleString();

    return { rate, date: formattedLastUpdateTime };
  };
};

export const getRates = syncRate();

export const formatMessage = (rate: string | null, date: string) =>
  rate ? `${rate}\n${date}` : 'There is no rates yet';
