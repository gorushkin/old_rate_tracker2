import { TOKEN } from './config';
import TelegramBot from 'node-telegram-bot-api';
import { commandsList } from './constants';
import { onCallbackQuery, onGetRates, onStart } from './controllers';

if (!TOKEN) throw new Error('You should set bot token!');

const init = async (TOKEN: string) => {
  const bot = new TelegramBot(TOKEN, { polling: true });

  bot.setMyCommands(commandsList);

  bot.on('callback_query', (message) => onCallbackQuery(message, bot));

  bot.onText(/\/start/, (message) => onStart(message, bot));

  bot.onText(/\/get_rate/, (message) => onGetRates(message, bot));
};

init(TOKEN);
