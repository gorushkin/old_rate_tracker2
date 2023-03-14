import TelegramBot, { Message, CallbackQuery } from 'node-telegram-bot-api';
import { CALL_BACK_DATA, defaultOptions } from './constants';
import { convertRatesToString } from './utils';
import { scheduler } from './scheduler';

const mapping: Record<CALL_BACK_DATA, () => Promise<string>> = {
  GET_RATES: async () => {
    const { rates, date } = (await scheduler).getInfo();
    return convertRatesToString(rates, date);
  },
  TEST: async () => 'This is the test!!!',
};

export const onCallbackQuery = async (message: CallbackQuery, bot: TelegramBot) => {
  const data = message.data as CALL_BACK_DATA;
  const chat_id = message.from.id;

  const messageText = await mapping[data]();
  bot.sendMessage(chat_id, messageText, defaultOptions);
};

export const onStart = async (message: Message, bot: TelegramBot) => {
  const chatId = message.chat.id;
  const username = message.chat.username || 'username';

  bot.sendMessage(chatId, `Hi, ${username}`);
};

export const onGetRates = async (message: Message, bot: TelegramBot) => {
  const chatId = message.chat.id;
  const { rates, date } = (await scheduler).getInfo();

  bot.sendMessage(chatId, convertRatesToString(rates, date), defaultOptions);
};
