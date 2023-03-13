import { TOKEN } from './config';
import TelegramBot from 'node-telegram-bot-api';
import { addRoutes } from './routes';
import { scheduler } from './scheduler';

if (!TOKEN) throw new Error('You should set bot token!');

const init = async (TOKEN: string) => {
  const bot = new TelegramBot(TOKEN, { polling: true });

  (await scheduler).start();
  addRoutes(bot);
};

init(TOKEN);
