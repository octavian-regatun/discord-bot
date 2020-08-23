import { Message } from 'discord.js';
import { getMinuteString } from '../utils/utils';
import { startIntervalGetActivities } from './intervalGetActivities/intervalGetActivities';

export async function startGetActivities(
  message: Message,
  timerMinute: number
): Promise<void> {
  const defaultTimerMinute = 3;

  if (isNaN(timerMinute)) {
    timerMinute = defaultTimerMinute;
  }

  const timer = timerMinute * 60 * 1000;

  await message.reply(
    `Get activity interval started, running every ${getMinuteString(
      timerMinute
    )}`
  );

  startIntervalGetActivities(message, timer);
}
