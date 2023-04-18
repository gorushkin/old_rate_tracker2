import TelegramBot, { Message, CallbackQuery } from 'node-telegram-bot-api';
import { CALL_BACK_DATA, commandsList } from '../constants';

import { userService } from '../../services/UserService';
import { User } from '../../entity/user';
import { BotError } from '../error';
import { state } from '../botState';
import * as queryCotrollers from './callbackQueryControllers';
import { onUpdateTimeZoneOffset } from './messageControllers';
import * as onTextControllers from './textControllers';

type Mapping = Record<
  CALL_BACK_DATA,
  (bot: TelegramBot, chat_id: number, message_id: number, user: User) => Promise<void>
>;

const mapping: Mapping = {
  [CALL_BACK_DATA.GET_RATES]: queryCotrollers.onGetRatesCallbackQuery,
  [CALL_BACK_DATA.TEST]: queryCotrollers.onTestCallbackQuery,
  [CALL_BACK_DATA.SETTINGS]: queryCotrollers.onSettingsCallbackQuery,
  [CALL_BACK_DATA.SET_CUR]: queryCotrollers.onSetCurrenciesCallbackQuery,
  [CALL_BACK_DATA.SET_RR]: queryCotrollers.onReminderCallbackQuery,
  [CALL_BACK_DATA.SET_TZ]: queryCotrollers.onSetTimeZoneOffsetCallbackQuery,
};

const onCallbackQuery = async (query: CallbackQuery, bot: TelegramBot) => {
  if (!query.message) throw new BotError('There is no message!!!!!');

  const {
    message_id,
    chat: { id: chat_id },
  } = query.message;

  const mode = query.data as CALL_BACK_DATA;
  const id = query.from.id;
  const username = query.from.username || 'username';
  const user = await userService.forceAddUser(id, username);

  if (!user) throw new BotError('Something went wrong');

  const actions = Object.keys(CALL_BACK_DATA);

  const currencies = await state.getCurrencies();
  const isCurrencyRequest = !!currencies.find((item) => item.name === mode);

  const userState = state.getState(id);

  if (!userState) throw new BotError('User dissapeared!!!!');

  if (isCurrencyRequest && userState.mode === CALL_BACK_DATA.SET_CUR) {
    return await queryCotrollers.onSelectCurrenciesCallbackQuery(
      bot,
      mode as string,
      user,
      chat_id,
      message_id
    );
  }

  if (actions.includes(mode)) state.setState(id, { user, mode });

  const action = mapping[mode];
  await action(bot, chat_id, message_id, user);
};

const onMessage = async (message: Message, bot: TelegramBot) => {
  const id = message.chat.id;
  const user = state.getState(id);

  const isMessageFromCommandList = commandsList.find(({ command }) => command === message.text);
  if (isMessageFromCommandList) return;

  if (!user) throw new BotError('', { type: 'user', id, username: '', bot });

  if (user.mode === CALL_BACK_DATA.SET_TZ) return onUpdateTimeZoneOffset(bot, user, message);
  onTextControllers.onStartText(message, bot);
};

export const controllers = { onCallbackQuery, onMessage };
