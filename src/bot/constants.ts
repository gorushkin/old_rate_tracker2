import { TypeCurrency } from '../utils/types';

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
  SETTINGS = 'SETTINGS',
  SET_TZ = 'SET_TZ',
  SET_CUR = 'SET_CUR',
  SET_RR = 'SET_RR',
  SELECTED_CUR = 'SELECTED_CUR',
  UNSELECTED_CUR = 'UNSELECTED_CUR',
}

export const currencies: TypeCurrency[] = ['USD', 'NZD', 'EUR', 'TRY'];

export const defaultimezoneOffset = 3;
