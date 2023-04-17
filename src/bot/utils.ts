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

export const isTimeZoneOffsetCorrect = (timeZoneOffset: string) => {
  // TODO: Сделать ввлидацию
  return timeZoneOffset === '+03:00';
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
