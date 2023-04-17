import TelegramBot from 'node-telegram-bot-api';
import { commandsList } from './constants';
import { controllers } from './controllers';
import { errorHandler, sendErrorMessage } from './error';
import * as onTextControllers from './controllers/textControllers';

export const addRoutes = async (bot: TelegramBot) => {
  bot.setMyCommands(commandsList);

  bot.on('callback_query', (message) =>
    errorHandler(
      controllers.onCallbackQuery(message, bot),
      'callback_query',
      sendErrorMessage(message.from.id, bot)
    )
  );

  bot.onText(
    /\/start/,
    async (message) =>
      await errorHandler(
        onTextControllers.onStartText(message, bot),
        'onStart',
        sendErrorMessage(message.chat.id, bot)
      )
  );

  bot.onText(/\/get_rate/, (message) =>
    errorHandler(
      onTextControllers.onGetRatesText(message, bot),
      'onGetRates',
      sendErrorMessage(message.chat.id, bot)
    )
  );

  bot.onText(/\/get_logs/, (message) =>
    errorHandler(
      onTextControllers.onGetLogs(message, bot),
      'onGetLogs',
      sendErrorMessage(message.chat.id, bot)
    )
  );

  bot.on('message', (message) => {
    errorHandler(
      controllers.onMessage(message, bot),
      'onMessage',
      sendErrorMessage(message.chat.id, bot)
    );
  });

  bot.on('error', (e) => {
    console.log(e);
  });
};
