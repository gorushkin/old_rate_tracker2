import TelegramBot from 'node-telegram-bot-api';
import { User } from '../../entity/user';
import {
  convertRatesToString,
  getCurrenciesInfo,
  getCurrenciesKeyboard,
  getHiddenMessage,
  getUserRates,
} from '../utils';
import { scheduler } from '../../utils/scheduler';
import { backToSettingsOptions, defaultOptions, settingsKeyboardOptions } from '../keyboard';
import { currencyService } from '../../services/CurrencyService';
import { userService } from '../../services/UserService';
import { TypeCurrency } from '../../utils/types';
import { BotError } from '../error';

export const onGetRatesCallbackQuery = async (
  bot: TelegramBot,
  _chat_id: number,
  _message_id: number,
  user: User
) => {
  const { rates, date } = (await scheduler).getInfo();
  const userRates = getUserRates(rates, user);
  const message = convertRatesToString(userRates, date);
  const options = defaultOptions;

  bot.sendMessage(user.id, message, { ...options, parse_mode: 'HTML' });
};

export const onTestCallbackQuery = async (
  bot: TelegramBot,
  chat_id: number,
  message_id: number
) => {
  const message = 'This is the test!!!';
  const options = defaultOptions;

  const hiddenMessage = getHiddenMessage(message);

  bot.editMessageText(hiddenMessage, {
    chat_id,
    message_id,
    parse_mode: 'HTML',
    ...options,
  });
};

export const onReminderCallbackQuery = async (
  bot: TelegramBot,
  chat_id: number,
  message_id: number
) => {
  const message = 'Здесь вы можете настроить время ежедневных уведомлений';
  const options = backToSettingsOptions;

  const hiddenMessage = getHiddenMessage(message);

  bot.editMessageText(hiddenMessage, {
    chat_id,
    message_id,
    parse_mode: 'HTML',
    ...options,
  });
};

export const onSettingsCallbackQuery = async (
  bot: TelegramBot,
  chat_id: number,
  message_id: number
) => {
  const message =
    'Здесь вы можете настроить валюты, включить напоминания, сменить свой часовой пояс';
  const options = settingsKeyboardOptions;

  const hiddenMessage = getHiddenMessage(message);

  bot.editMessageText(hiddenMessage, {
    chat_id,
    message_id,
    parse_mode: 'HTML',
    ...options,
  });
};

export const onSetCurrenciesCallbackQuery = async (
  bot: TelegramBot,
  chat_id: number,
  message_id: number,
  user: User
) => {
  const { userCurrenciesText, filteredСurrenciesText } = await getCurrenciesInfo(user);

  const message = `Здесь вы можете настроить валюты\nВаши валюты: ${userCurrenciesText}\nВсе валюты: ${filteredСurrenciesText}`;
  const options = await getCurrenciesKeyboard(user);

  const hiddenMessage = getHiddenMessage(message);

  bot.editMessageText(hiddenMessage, {
    chat_id,
    message_id,
    parse_mode: 'HTML',
    ...options,
  });
};

export const onSelectCurrenciesCallbackQuery = async (
  bot: TelegramBot,
  name: string,
  user: User,
  chat_id: number,
  message_id: number
) => {
  const currency = await currencyService.getCurrency(name as TypeCurrency);
  if (!currency) throw new BotError('There is no currency!!!!');
  const updatedUser = await userService.updateUserCurrencies(currency, user.id);
  if (!updatedUser) throw new BotError('The user dissapeared!!!!');

  const { userCurrenciesText, filteredСurrenciesText } = await getCurrenciesInfo(updatedUser);
  const options = await getCurrenciesKeyboard(updatedUser);
  const message = `Здесь вы можете настроить валюты\nВаши валюты: ${userCurrenciesText}\nВсе валюты: ${filteredСurrenciesText}`;

  const hiddenMessage = getHiddenMessage(message);

  bot.editMessageText(hiddenMessage, {
    chat_id,
    message_id,
    parse_mode: 'HTML',
    ...options,
  });
};

export const onSetTimeZoneOffsetCallbackQuery = async (
  bot: TelegramBot,
  chat_id: number,
  message_id: number,
  user: User
) => {
  const { timeZoneOffset } = user;

  const message = `Введите смещение часового пояса в формате "+/-hh:00".\nВаше текущее смещение: ${timeZoneOffset}`;

  const options = backToSettingsOptions;

  const hiddenMessage = getHiddenMessage(message);

  bot.editMessageText(hiddenMessage, {
    chat_id,
    message_id,
    parse_mode: 'HTML',
    ...options,
  });
};
