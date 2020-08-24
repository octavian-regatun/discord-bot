import moment from 'moment';
import { User } from 'discord.js';

export function isUserOffline(user: User): boolean {
  return user.presence.status === 'offline';
}

export function isUserBot(user: User): boolean {
  return user.bot === true;
}

export function abbreviateActivity(activityName: string): string {
  switch (activityName) {
    case 'Counter-Strike: Global Offensive':
      return 'CS:GO';
    case 'Visual Studio Code':
      return 'VS Code';
    case 'League of Legends':
      return 'LoL';

    default:
      return activityName;
  }
}

export function getDurationAsSeconds(timestamp: number): number {
  const now = moment(Date.now());
  const start = moment(timestamp);

  const duration = moment.duration(now.diff(start));
  return Math.floor(duration.asSeconds());
}

export function secondsToTime(
  secondsTotal: number
): { h: number; m: number; s: number } {
  const hours = Math.floor(secondsTotal / (60 * 60));

  const divisor_for_minutes = secondsTotal % (60 * 60);
  const minutes = Math.floor(divisor_for_minutes / 60);

  const divisor_for_seconds = divisor_for_minutes % 60;
  const seconds = Math.ceil(divisor_for_seconds);
  return {
    h: hours,
    m: minutes,
    s: seconds,
  };
}

export function formatTime(time: number): string {
  if (time < 10) {
    return `0${time}`;
  } else {
    return time.toString();
  }
}

export function getMinuteString(minute: number): string {
  if (minute <= 1) {
    return `${minute} minute`;
  } else {
    return `${minute} minutes`;
  }
}
