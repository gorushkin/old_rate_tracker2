import TelegramBot from 'node-telegram-bot-api';
import { commandsList } from './constants';
import { services } from './controllers';

export const addRoutes = (bot: TelegramBot) => {
  bot.setMyCommands(commandsList);

  bot.on('callback_query', (message) => services.onCallbackQuery(message, bot));

  bot.onText(/\/start/, (message) => services.onStart(message, bot));

  bot.onText(/\/get_rate/, (message) => services.onGetRates(message, bot));

  bot.onText(/\/get_logs/, (message) => services.onGetLogs(message, bot));
};
