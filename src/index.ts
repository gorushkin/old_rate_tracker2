import { TOKEN } from './config';
import TelegramBot from 'node-telegram-bot-api';
import { addRoutes } from './bot/routes';
import { scheduler } from './scheduler';
import { logger } from './logger';
import { BotError } from './bot/error';
import { AppDataSource } from './db/data-source';

if (!TOKEN) throw new Error('You should set bot token!');

const init = async (token: string) => {
  const bot = new TelegramBot(token, { polling: true });
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
  (await scheduler).start();

  try {
    await addRoutes(bot);
  } catch (error) {
    logger.addAppLog({ name: 'addRoutes' });
    const errorMessage = error instanceof Error ? error.message : 'In addRoutes error';
    throw new BotError(errorMessage);
  }
};

init(TOKEN).catch((error) => {
  console.log(error);
  process.exit(1);
});
