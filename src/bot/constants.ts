import { InlineKeyboardButton, SendMessageOptions } from 'node-telegram-bot-api';
import { Currency } from '../types';

export const minute = 1000 * 60;

export enum COMMAND {
  START = '/start',
  INFO = '/info',
  GET_RATE = '/get_rate',
  GET_LOGS = '/get_logs',
}

export const commandsList = [
  { command: COMMAND.START, description: "Let's go" },
  { command: COMMAND.INFO, description: 'Some info' },
  { command: COMMAND.GET_RATE, description: 'Get usd rate' },
  { command: COMMAND.GET_LOGS, description: 'Get all logs' },
];

export enum CALL_BACK_DATA {
  GET_RATES = 'GET_RATES',
  TEST = 'TEST',
}

const getRatesButton: InlineKeyboardButton = {
  text: 'Get rates',
  callback_data: CALL_BACK_DATA.GET_RATES,
};

const testButton: InlineKeyboardButton = {
  text: 'Test',
  callback_data: CALL_BACK_DATA.TEST,
};

export const defaultKeyboard: InlineKeyboardButton[][] = [[getRatesButton, testButton]];

export const defaultOptions: SendMessageOptions = {
  reply_markup: {
    inline_keyboard: defaultKeyboard,
  },
};

export const currencies: Currency[] = ['USD', 'NZD', 'EUR', 'TRY'];

export const defaultimezoneOffset = 3;
