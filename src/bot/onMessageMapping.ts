import { CALL_BACK_DATA } from './constants';

type Mapping = Record<CALL_BACK_DATA, (message: string) => Promise<{ message: string }>>;

const onMessageMapping: Mapping = {
  CURRENCIES: async (message: string) => {
    return { message: 'CURRENCIES' };
  },
  GET_RATES: async (message: string) => {
    return { message: 'GET_RATES' };
  },
  REMINDER: async (message: string) => {
    return { message: 'REMINDER' };
  },
  SETTINGS: async (message: string) => {
    return { message: 'SETTINGS' };
  },
  TEST: async (message: string) => {
    return { message: 'TEST' };
  },
  TIME_ZONE: async (message: string) => {
    return { message: 'TIME_ZONE' };
  },
};
