import TelegramBot, { Message } from 'node-telegram-bot-api';
import { userService } from '../../services/UserService';
import { UserDTO } from '../botState';
import { backToSettingsOptions } from '../keyboard';
import { formatTimeZoneOffset, getTimeZoneOffset as getTimeZoneOffset } from '../utils';

export  const onUpdateTimeZoneOffset = async (bot: TelegramBot, { user: { id } }: UserDTO, message: Message) => {
  const timeZoneOffset = getTimeZoneOffset(message.text || '');
  if (!timeZoneOffset && timeZoneOffset !== 0) {
    return bot.sendMessage(
      id,
      'Неправильный формат.\nПопробуйте заново или вернитесь назад',
      backToSettingsOptions
    );
  }
  const formattedTimeZoneOffset = formatTimeZoneOffset(timeZoneOffset);

  await userService.updateUserTimeZoneOffset(id, Number(timeZoneOffset));
  bot.sendMessage(id, `Ваш новый часовой пояс ${formattedTimeZoneOffset}`, backToSettingsOptions);
};
