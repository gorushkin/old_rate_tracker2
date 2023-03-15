import TelegramBot, { Message, CallbackQuery } from 'node-telegram-bot-api';
import { CALL_BACK_DATA, defaultOptions } from './constants';
import { convertRatesToString, logger } from './utils';
import { scheduler } from './scheduler';
import { ADMIN_ID } from './config';

const mapping: Record<CALL_BACK_DATA, () => Promise<string>> = {
  GET_RATES: async () => {
    const { rates, date } = (await scheduler).getInfo();
    return convertRatesToString(rates, date);
  },
  TEST: async () => 'This is the test!!!',
};

const onCallbackQuery = async (message: CallbackQuery, bot: TelegramBot) => {
  const data = message.data as CALL_BACK_DATA;
  const chat_id = message.from.id;
  const messageText = await mapping[data]();
  logger.addLog({ username: message.from.username, action: `onCallbackQuery - ${data}` });
  bot.sendMessage(chat_id, messageText, defaultOptions);
};

const onStart = async (message: Message, bot: TelegramBot) => {
  const chatId = message.chat.id;
  const username = message.chat.username || 'username';

  bot.sendMessage(chatId, `Hi, ${username}`);
};

const onGetRates = async (message: Message, bot: TelegramBot) => {
  const chatId = message.chat.id;
  const { rates, date } = (await scheduler).getInfo();
  logger.addLog({ username: message.chat.username, action: 'onGetRates' });
  bot.sendMessage(chatId, convertRatesToString(rates, date), defaultOptions);
};

const onGetLogs = async (message: Message, bot: TelegramBot) => {
  const chatId = message.chat.id;
  logger.addLog({ username: message.chat.username, action: 'onGetLogs' });
  const logs = logger.getLogs();
  const id = message.from?.id;
  const messageText = id == ADMIN_ID ? logs : 'No!!!';
  bot.sendMessage(chatId, messageText, defaultOptions);
};

export const services = { onCallbackQuery, onStart, onGetRates, onGetLogs };
