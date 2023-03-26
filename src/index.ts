import { TOKEN, DB_PATH } from './config';
import TelegramBot from 'node-telegram-bot-api';
import { addRoutes } from './bot/routes';
import { scheduler } from './scheduler';
import { logger } from './logger';
import { BotError } from './bot/error';
import { DB } from './db/db';
import { DBError } from './db/error';

if (!TOKEN) throw new Error('You should set bot token!');
if (!DB_PATH) throw new Error('You should set db path!');
export const db = new DB();

const init = async (token: string, db_path: string) => {
  const bot = new TelegramBot(token, { polling: true });

  await db.addPath(db_path);

  (await scheduler).start();

  try {
    await addRoutes(bot);
  } catch (error) {
    logger.addAppLog({ name: 'addRoutes' });
    const errorMessage = error instanceof Error ? error.message : 'In addRoutes error';
    throw new BotError(errorMessage);
  }
};

init(TOKEN, DB_PATH).catch((error) => {
  const message = error instanceof DBError ? error.message : 'error init';
  logger.addAppLog({ name: message });
  process.exit(1);
});
