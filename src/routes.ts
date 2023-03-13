import TelegramBot from 'node-telegram-bot-api';
import { commandsList } from './constants';
import { onCallbackQuery, onGetRates, onStart } from './controllers';

export const addRoutes = (bot: TelegramBot) => {
  bot.setMyCommands(commandsList);

  bot.on('callback_query', (message) => onCallbackQuery(message, bot));

  bot.onText(/\/start/, (message) => onStart(message, bot));

  bot.onText(/\/get_rate/, (message) => onGetRates(message, bot));
};
