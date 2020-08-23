import { getActivities } from '../getActivities';
import { Message } from 'discord.js';

let interval;

export function startIntervalGetActivities(
  message: Message,
  timer: number
): void {
  interval = setInterval(
    (message) => {
      void getActivities(message, true);
    },
    timer,
    message
  );
}

export function stopIntervalGetActivities(): void {
  clearInterval(interval);
}
