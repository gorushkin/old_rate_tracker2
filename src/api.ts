import axios from 'axios';

const API_URL = 'https://api.coingate.com/v2/rates/merchant/USD/RUB';

export const getRate = async (): Promise<string | null> => {
  try {
    const { data } = await axios(API_URL);
    return data;
  } catch (error) {
    return null;
  }
};
