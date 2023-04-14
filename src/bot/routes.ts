import TelegramBot from 'node-telegram-bot-api';
import { commandsList } from './constants';
import { services } from './controllers';
import { errorHandler, sendErrorMessage } from './error';

export const addRoutes = async (bot: TelegramBot) => {
  bot.setMyCommands(commandsList);

  bot.on('callback_query', (message) =>
    errorHandler(
      services.onCallbackQuery(message, bot),
      'callback_query',
      sendErrorMessage(message.from.id, bot)
    )
  );

  bot.onText(
    /\/start/,
    async (message) =>
      await errorHandler(
        services.onStart(message, bot),
        'onStart',
        sendErrorMessage(message.chat.id, bot)
      )
  );

  bot.onText(/\/get_rate/, (message) =>
    errorHandler(
      services.onGetRates(message, bot),
      'onGetRates',
      sendErrorMessage(message.chat.id, bot)
    )
  );

  bot.onText(/\/get_logs/, (message) =>
    errorHandler(
      services.onGetLogs(message, bot),
      'onGetLogs',
      sendErrorMessage(message.chat.id, bot)
    )
  );

  bot.on('message', (message) => {
    errorHandler(
      services.onMessage(message, bot),
      'onMessage',
      sendErrorMessage(message.chat.id, bot)
    );
  });

  bot.on('error', (e) => {
    console.log(e);
  });
};
