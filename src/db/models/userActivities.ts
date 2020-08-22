import { IUser, IActivity } from './../../utils/data';
import mongoose, { Schema, Document } from 'mongoose';
import { Snowflake } from 'discord.js';

export interface IActivitySchema extends IActivity {
  updatedAt: number;
}

export interface IUserActivitiesSchema extends Document {
  user: IUser;
  activities: IActivitySchema[];
  guildsId: Snowflake[];
  updatedAt: number;
}

const UserActivitiesSchema: Schema = new Schema({
  user: {
    name: String,
    id: String,
  },
  activities: { type: Array, required: true },
  guildsId: Array,
  updatedAt: Date,
});

// Export the model and return your IUser interface
export default mongoose.model<IUserActivitiesSchema>(
  'UserActivities',
  UserActivitiesSchema,
  'UsersActivities'
);
