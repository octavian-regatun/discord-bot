import { Snowflake } from 'discord.js';

export type ITable = (string | number | undefined | null)[][];

export interface IUserActivities {
  user: IUser;
  activities: IActivity[];
  guildId: Snowflake;
}

export interface IUser {
  name: string;
  id: Snowflake;
}
export interface IActivity {
  name: string;
  duration: number;
}
