import TelegramBot, { Message } from 'node-telegram-bot-api';
import { logger } from '../utils/logger';
import * as onTextControllers from '../bot/controllers/textControllers';
import { defaultOptions } from './keyboard';

type ErrorType = 'user';

type ErrorInfo =
  | undefined
  | {
      type: ErrorType;
      bot: TelegramBot;
      id: number;
      username: string;
    };

export class BotError extends Error {
  errorInfo: ErrorInfo | undefined;

  constructor(message: string, errorInfo?: ErrorInfo) {
    super(message);
    Error.captureStackTrace(this, BotError);
    this.name = 'BotError';
    this.errorInfo = errorInfo;
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
    if (error instanceof BotError && error.errorInfo?.type === 'user') {
      const { bot, id, username = 'username' } = error.errorInfo;
      bot.sendMessage(id, `Hi, ${username}`, defaultOptions);
    } else {
      sendError('there is an error');
      console.log('error: ', error);
      logger.addAppLog({ name: routeName });
    }
  }
};
