import TelegramBot, { Message, CallbackQuery } from 'node-telegram-bot-api';
import { CALL_BACK_DATA, defaultOptions } from './constants';
import { convertRatesToString, getUserRates } from './utils';
import { scheduler } from '../utils/scheduler';
import { ADMIN_ID } from '../utils/config';
import { logger } from '../utils/logger';
import { userService } from '../services/UserService';
import { User } from '../entity/user';

type Mapping = Record<CALL_BACK_DATA, (user: User | null) => Promise<string>>;

const mapping: Mapping = {
  GET_RATES: async (user) => {
    const { rates, date } = (await scheduler).getInfo();
    const userRates = getUserRates(rates, user);
    return convertRatesToString(userRates, date);
  },
  TEST: async () => 'This is the test!!!',
};

const onCallbackQuery = async (message: CallbackQuery, bot: TelegramBot) => {
  const data = message.data as CALL_BACK_DATA;
  const id = message.from.id;
  const user = await userService.getUser(id);
  const messageText = await mapping[data](user);
  logger.addUserRequestLog({
    username: message.from.username,
    action: `onCallbackQuery - ${data}`,
  });
  bot.sendMessage(id, messageText, defaultOptions);
};

const onStart = async (message: Message, bot: TelegramBot) => {
  const chatId = message.chat.id;
  const username = message.chat.username || 'username';
  const id = message.chat.id;
  const user = await userService.getUser(id);
  if (!user) await userService.addUser(id, username);

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

export const services = { onCallbackQuery, onStart, onGetRates, onGetLogs };
