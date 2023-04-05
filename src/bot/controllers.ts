import TelegramBot, { Message, CallbackQuery, EditMessageTextOptions } from 'node-telegram-bot-api';
import { CALL_BACK_DATA } from './constants';
import { convertRatesToString, getCurData, getHiddenMessage, getUserRates } from './utils';
import { scheduler } from '../utils/scheduler';
import { ADMIN_ID } from '../utils/config';
import { logger } from '../utils/logger';
import { userService } from '../services/UserService';
import { User } from '../entity/user';
import { backToSettingsOptions, defaultOptions, settingsKeyboardOptions } from './keyboard';
import { BotError } from './error';
import { state } from './botState';
import { TypeCurrency } from '../utils/types';
import { currencyService } from '../services/CurrencyService';

type Mapping = Record<
  CALL_BACK_DATA,
  (user: User) => Promise<{ message: string; options: EditMessageTextOptions }>
>;

const mapping: Mapping = {
  GET_RATES: async (user) => {
    const { rates, date } = (await scheduler).getInfo();
    const userRates = getUserRates(rates, user);
    const message = convertRatesToString(userRates, date);
    const options = defaultOptions;
    return { message, options };
  },
  TEST: async () => {
    const message = 'This is the test!!!';
    return { message, options: defaultOptions };
  },
  SETTINGS: async () => {
    const message =
      'Здесь вы можете настроить валюты, включить напоминания, сменить свой часовой пояс';
    return { message, options: settingsKeyboardOptions };
  },
  SET_CUR: async (user) => {
    return await getCurData(user);
  },
  SET_RR: async () => {
    const message = 'REMINDER';
    return { message, options: backToSettingsOptions };
  },
  SET_TZ: async () => {
    const message = 'TIME_ZONE';
    return { message, options: backToSettingsOptions };
  },
  SELECTED_CUR: async () => {
    const message = 'TIME_ZONE';
    return { message, options: backToSettingsOptions };
  },
  UNSELECTED_CUR: async () => {
    const message = 'TIME_ZONE';
    return { message, options: backToSettingsOptions };
  },
};

const updateUserCurrencies = async (name: string, user: User) => {
  const currency = await currencyService.getCurrency(name as TypeCurrency);
  if (!currency) throw new BotError('There i no currency!!!!');
  const updatedUser = await userService.updateUserCurrencies(currency, user.id);
  if (!updatedUser) throw new BotError('The user dissapeared!!!!');
  return await getCurData(updatedUser);
};

const onCallbackQuery = async (query: CallbackQuery, bot: TelegramBot) => {
  if (!query.message) {
    throw new BotError('There is no message!!!!!');
  }
  const {
    message_id,
    chat: { id: chat_id },
  } = query.message;

  const data = query.data as CALL_BACK_DATA;
  const id = query.from.id;
  const username = query.from.username || 'username';
  const user = await userService.forceAddUser(id, username);

  if (!user) throw new BotError('Something went wrong');

  const currencies = await state.getCurrencies();

  const isCurrencyRequest = !!currencies.find((item) => item.name === data);

  const { message, options } = isCurrencyRequest
    ? await updateUserCurrencies(data as string, user)
    : await mapping[data](user);

  state.setState(id, data);

  logger.addUserRequestLog({
    username: query.from.username,
    action: `onCallbackQuery - ${data}`,
  });

  const hiddenMessage = getHiddenMessage(message);

  if (data === CALL_BACK_DATA.GET_RATES) {
    return bot.sendMessage(id, hiddenMessage, { ...options, parse_mode: 'HTML' });
  }

  bot.editMessageText(hiddenMessage, {
    chat_id,
    message_id,
    parse_mode: 'HTML',
    ...options,
  });
};

const onStart = async (message: Message, bot: TelegramBot) => {
  const chatId = message.chat.id;
  const username = message.chat.username || 'username';
  const id = message.chat.id;
  await userService.forceAddUser(id, username);

  bot.sendMessage(chatId, `Hi, ${username}`, defaultOptions);
};

const onGetRates = async (message: Message, bot: TelegramBot) => {
  const id = message.chat.id;
  const user = await userService.getUser(id);
  if (!user?.currencies) {
    bot.sendMessage(id, 'There is currencies. Please, update your settings', defaultOptions);
  }
  const { rates, date } = (await scheduler).getInfo();
  const userRates = getUserRates(rates, user);
  logger.addUserRequestLog({ username: message.chat.username, action: 'onGetRates' });
  bot.sendMessage(id, convertRatesToString(userRates, date), defaultOptions);
};

const onGetLogs = async (message: Message, bot: TelegramBot) => {
  const chatId = message.chat.id;
  logger.addUserRequestLog({ username: message.chat.username, action: 'onGetLogs' });
  const logs = logger.getLogs();
  const id = message.from?.id;
  const messageText = id == ADMIN_ID ? logs : 'No!!!';
  bot.sendMessage(chatId, messageText, defaultOptions);
};

const onMessage = async (message: Message, bot: TelegramBot) => {
  const id = message.chat.id;
  const mode = state.getState(id);
  if (!mode) return bot.sendMessage(id, 'I do not know what you want!!!!');
  bot.sendMessage(id, 'asdfsadfdfd');
};

export const services = { onCallbackQuery, onStart, onGetRates, onGetLogs, onMessage };
