import { TypeCurrency, Rates } from '../utils/types';
import { User } from '../entity/user';
import { state } from './botState';
import { getCurrenciesOptions } from './keyboard';

export const convertRatesToString = (data: Rates, date: string) => {
  const formattedRates = Object.entries(data)
    .map(([currency, rate]) => `${currency} - ${rate}`)
    .join('\n');

  return `${date}\n\n${formattedRates || 'we are fetching the data'}`;
};

export const getUserRates = (rates: Rates, user: User | null) => {
  if (!user) return rates;
  return user.currencies.reduce<Rates>((acc, item) => {
    const name = item.name as TypeCurrency;
    return { ...acc, ...(!!rates[name] && { [name]: rates[name] }) };
  }, {} as Rates);
};

export const getHiddenMessage = (message: string) => {
  const encodeMessage = Buffer.from(new Date().toISOString()).toString('base64');
  return `<a href="tg://btn/${encodeMessage}">\u200b</a>${message}`;
};

export const getTimeZoneOffset = (timeZoneOffset: string) => {
  const isNumeric = (str: string) => {
    if (typeof str !== 'string') return null;
    return !Number.isNaN(str) && !isNaN(parseFloat(str));
  };

  const prefix = timeZoneOffset.slice(0, 1);
  if (prefix !== '+' && prefix !== '-') return null;

  const mathSign = prefix === '+' ? 1 : -1;
  const rawOffset = timeZoneOffset.split('').slice(1);

  if (rawOffset.length > 5 || rawOffset.length < 4) return null;
  if (rawOffset.length === 5 && rawOffset[2] !== ':') return null;
  const offset = rawOffset.filter(isNumeric);
  if (offset.length < 4) return false;
  const hh = Number(offset.slice(0, 2).join(''));
  const mm = Number(offset.slice(2, 4).join(''));
  return (hh * 60 + mm) * mathSign;
};

export const getCurrenciesInfo = async (user: User) => {
  const userCurrenciesText = user.currencies.map(({ name }) => name).join(', ');
  const allСurrencies = await state.getCurrencies();
  const filteredСurrencies = allСurrencies.filter(
    ({ name }) => name !== user.defaultCurrency?.name
  );
  const filteredСurrenciesText = filteredСurrencies.map(({ name }) => name).join(', ');

  return { userCurrenciesText, filteredСurrenciesText };
};

export const getCurrenciesKeyboard = async (user: User) => {
  const allСurrencies = await state.getCurrencies();

  const allСurrenciesWithExtraInfo = allСurrencies
    .filter(({ name }) => name !== user.defaultCurrency?.name)
    .map((currency) => ({
      ...currency,
      isActive: !!user.currencies.find((userCurrency) => userCurrency.id === currency.id),
    }));

  const currenciesOptions = getCurrenciesOptions(allСurrenciesWithExtraInfo);

  return currenciesOptions;
};

export const getUserDate = (date: string, offset: number) => {
  const requestDate = new Date(date);

  const hh = requestDate.getUTCHours();
  const mm = requestDate.getUTCMinutes();
  const userTime = requestDate.setHours(hh, mm + offset);

  const formattedUserTime = new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(userTime);

  return formattedUserTime;
};

export const formatTimeZoneOffset = (timeZoneOffset: number) => {
  const absoluteValue = Math.abs(timeZoneOffset);
  const hh = Math.trunc(absoluteValue / 60);
  const mm = absoluteValue - hh * 60;
  const prefix = timeZoneOffset >= 0 ? '+' : '-';

  const formattedHH = hh < 10 ? `0${hh}` : hh.toString();
  const formattedMM = mm < 10 ? `0${mm}` : mm.toString();

  return `${prefix}${formattedHH}:${formattedMM}`;
};
