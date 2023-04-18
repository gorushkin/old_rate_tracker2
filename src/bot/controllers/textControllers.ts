import TelegramBot, { Message } from 'node-telegram-bot-api';
import { userService } from '../../services/UserService';
import { ADMIN_ID } from '../../utils/config';
import { logger } from '../../utils/logger';
import { updater } from '../../utils/rateUpdater';
import { defaultOptions } from '../keyboard';
import { getUserRates, convertRatesToString, getUserDate } from '../utils';
import { BotError } from '../error';

export const onStartText = async (message: Message, bot: TelegramBot) => {
  const chatId = message.chat.id;
  const username = message.chat.username || 'username';
  const id = message.chat.id;
  await userService.forceAddUser(id, username);

  bot.sendMessage(chatId, `Hi, ${username}`, defaultOptions);
};

export const onGetRatesText = async (message: Message, bot: TelegramBot) => {
  const id = message.chat.id;
  const user = await userService.getUser(id);

  if (!user) throw new BotError('There is no user!!!!');

  if (!user?.currencies) {
    bot.sendMessage(id, 'There is currencies. Please, update your settings', defaultOptions);
  }
  const { rates, date } = await updater.getRates();
  const userRates = getUserRates(rates, user);
  const userDate = getUserDate(date, user.timeZoneOffset);
  logger.addUserRequestLog({ username: message.chat.username, action: 'onGetRates' });
  bot.sendMessage(id, convertRatesToString(userRates, userDate), defaultOptions);
};

export const onGetLogs = async (message: Message, bot: TelegramBot) => {
  const chatId = message.chat.id;
  logger.addUserRequestLog({ username: message.chat.username, action: 'onGetLogs' });
  const logs = logger.getLogs();
  const id = message.from?.id;
  const messageText = id == ADMIN_ID ? logs : 'No!!!';
  bot.sendMessage(chatId, messageText, defaultOptions);
};
