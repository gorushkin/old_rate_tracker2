import {
  EditMessageTextOptions,
  InlineKeyboardButton,
  SendMessageOptions,
} from 'node-telegram-bot-api';
import { User } from '../entity/user';
import { CALL_BACK_DATA } from './constants';

type Keyboard = InlineKeyboardButton[][];

const getRatesButton: InlineKeyboardButton = {
  text: 'Get rates',
  callback_data: CALL_BACK_DATA.GET_RATES,
};

const testButton: InlineKeyboardButton = {
  text: 'Test',
  callback_data: CALL_BACK_DATA.TEST,
};

const settingsButton: InlineKeyboardButton = {
  text: 'Settings',
  callback_data: CALL_BACK_DATA.SETTINGS,
};

const currenciesButton: InlineKeyboardButton = {
  text: ' Set Currencies',
  callback_data: CALL_BACK_DATA.SET_CUR,
};

const timezoneButton: InlineKeyboardButton = {
  text: ' Set Timezone',
  callback_data: CALL_BACK_DATA.SET_TZ,
};

const reminderButton: InlineKeyboardButton = {
  text: ' Set Reminder',
  callback_data: CALL_BACK_DATA.SET_RR,
};

const backToSettingsButton: InlineKeyboardButton = {
  text: 'Back',
  callback_data: CALL_BACK_DATA.SETTINGS,
};

const backToHomeButton: InlineKeyboardButton = {
  text: 'Back',
  callback_data: CALL_BACK_DATA.GET_RATES,
};

const defaultKeyboard: Keyboard = [[getRatesButton, testButton, settingsButton]];

const settingsKeyboard: Keyboard = [
  [currenciesButton, timezoneButton],
  [reminderButton, backToHomeButton],
];

const backToSettingsKeyboard: Keyboard = [[backToSettingsButton]];

export const defaultOptions: EditMessageTextOptions = {
  reply_markup: {
    inline_keyboard: defaultKeyboard,
  },
};

export const keyboadWrapper = (keyboard: InlineKeyboardButton[][]): EditMessageTextOptions => ({
  reply_markup: {
    inline_keyboard: keyboard,
  },
});

export const settingsKeyboardOptions = keyboadWrapper(settingsKeyboard);

export const backToSettingsOptions = keyboadWrapper(backToSettingsKeyboard);

export const getCurrenciesOptions = (
  list: {
    isActive: boolean;
    id: number;
    name: string;
    users: User[];
  }[]
) => {
  const buttons: InlineKeyboardButton[] = list.map((item) => ({
    text: `${item.name}${item.isActive ? '*' : ''}`,
    callback_data: item.name,
  }));

  const keyboard: Keyboard = [buttons, [backToSettingsButton]];

  return keyboadWrapper(keyboard);
};
