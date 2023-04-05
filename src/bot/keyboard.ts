import {
  EditMessageTextOptions,
  InlineKeyboardButton,
  SendMessageOptions,
} from 'node-telegram-bot-api';
import { CALL_BACK_DATA } from './constants';

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
  callback_data: CALL_BACK_DATA.CURRENCIES,
};

const timezoneButton: InlineKeyboardButton = {
  text: ' Set Timezone',
  callback_data: CALL_BACK_DATA.TIME_ZONE,
};

const reminderButton: InlineKeyboardButton = {
  text: ' Set Reminder',
  callback_data: CALL_BACK_DATA.REMINDER,
};

const backToSettingsButton: InlineKeyboardButton = {
  text: 'Back',
  callback_data: CALL_BACK_DATA.SETTINGS,
};

export const defaultKeyboard: InlineKeyboardButton[][] = [
  [getRatesButton, testButton, settingsButton],
];

const settingsKeyboard: InlineKeyboardButton[][] = [
  [currenciesButton, timezoneButton],
  [reminderButton, reminderButton],
];

const backToSettingsKeyboard: InlineKeyboardButton[][] = [[backToSettingsButton]];

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
