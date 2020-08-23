import moment from 'moment';
import { User, Message } from 'discord.js';
import { table } from 'table';
import fs from 'fs/promises';
import text2png from 'text2png';

import { ITable } from './data';

export async function sendImageTable(
  message: Message,
  tableArray: ITable
): Promise<void> {
  if (message == undefined) {
    throw new Error('message parameter is undefined');
  }

  await fs.writeFile(
    'image.png',
    text2png(table(tableArray), {
      color: 'white',
      font: '32px Lucida Console',
      strokeWidth: 2,
    })
  );

  // const img = await textToImage.generate(table(tableArray), {
  //   fontFamily: 'Consolas',
  // });
  // const ext: string = img.split(';')[0].match(/jpeg|png|gif/)[0];
  // // strip off the data: url prefix to get just the base64-encoded bytes
  // const data = img.replace(/^data:image\/\w+;base64,/, '');
  // const buf = Buffer.from(data, 'base64');
  // await fs.writeFile(`image.${ext}`, buf);

  await message.channel.send('This is the activities table:', {
    files: ['image.png'],
  });
}

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
