import { IUser } from './../../utils/data';
import mongoose, { Schema, Document } from 'mongoose';
import { Snowflake } from 'discord.js';
import { IActivity } from '../../utils/data';

export interface IUserActivitiesSchema extends Document {
  user: IUser;
  activities: IActivity[];
  guildsId: Snowflake[];
  createdAt: number;
}

const UserActivitiesSchema: Schema = new Schema({
  user: {
    name: String,
    id: String,
  },
  activities: Array,
  guildsId: Array,
  createdAt: Date,
});

// Export the model and return your IUser interface
export default mongoose.model<IUserActivitiesSchema>(
  'UserActivities',
  UserActivitiesSchema,
  'UsersActivities'
);
