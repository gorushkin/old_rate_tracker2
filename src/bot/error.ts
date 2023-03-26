import TelegramBot from 'node-telegram-bot-api';
import { logger } from '../logger';

export class BotError extends Error {
  constructor(message: string) {
    super(message);
    Error.captureStackTrace(this, BotError);
    this.name = 'BotError';
  }
}

export const sendErrorMessage =
  (id: number, bot: TelegramBot) =>
  (message = 'there is an error') =>
    bot.sendMessage(id, message);

export const errorHandler = async (
  func: unknown,
  routeName: string,
  sendError: (id: string, message?: string) => Promise<TelegramBot.Message>
): Promise<void | never> => {
  try {
    await func;
  } catch (error) {
    sendError('there is an error');
    logger.addAppLog({ name: routeName });
  }
};
