import { TOKEN } from './config';
import TelegramBot from 'node-telegram-bot-api';
import { addRoutes } from './routes';
import { scheduler } from './scheduler';
import { logger } from './logger';
import { BotError } from './error';

if (!TOKEN) throw new Error('You should set bot token!');

const init = async (TOKEN: string) => {
  const bot = new TelegramBot(TOKEN, { polling: true });

  (await scheduler).start();

  try {
    await addRoutes(bot);
  } catch (error) {
    logger.addAppLog({ name: 'addRoutes' });
    const errorMessage = error instanceof Error ? error.message : 'In addRoutes error';
    throw new BotError(errorMessage);
  }
};

init(TOKEN).catch(() => process.exit(1));
