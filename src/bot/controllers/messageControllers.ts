import TelegramBot, { Message } from 'node-telegram-bot-api';
import { userService } from '../../services/UserService';
import { UserDTO } from '../botState';
import { backToSettingsOptions } from '../keyboard';
import { isTimeZoneOffsetCorrect } from '../utils';

export  const onUpdateTimeZoneOffset = async (bot: TelegramBot, { user: { id } }: UserDTO, message: Message) => {
  const timezoneOffset = message.text || '';
  // TODO: Добавить ошибку валидации с выводом нужной клавиатуры
  if (!isTimeZoneOffsetCorrect(timezoneOffset)) {
    return bot.sendMessage(
      id,
      'Неправильный формат.\nПопробуйте заново или вернитесь назад',
      backToSettingsOptions
    );
  }
  await userService.updateUserTimeZoneOffset(id, timezoneOffset);
  bot.sendMessage(id, `Ваша новый часовой пояс ${timezoneOffset}`, backToSettingsOptions);
};
