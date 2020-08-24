import {
  IUserActivitiesSchema,
  IActivitySchema,
} from './../db/models/userActivities';
import { IActivity, ITable, IUserActivities } from './../utils/data';
import UserActivities from '../db/models/userActivities';
import { Message, Snowflake } from 'discord.js';
import {
  isUserOffline,
  getDurationAsSeconds,
  abbreviateActivity,
  secondsToTime,
  isUserBot,
  formatTime,
} from '../utils/utils';
import {
  addColumn,
  addRow,
  getIndexUser,
  getIndexActivity,
  formatTable,
  isActivityInTable,
} from '../utils/table';

import { table } from 'table';
import fs from 'fs';
import text2png from 'text2png';

export async function getActivities(
  message: Message,
  interval = false
): Promise<void> {
  if (message.guild == undefined) {
    throw new Error('property guild of message parameter is undefined');
  }

  if (!message.guild.available) {
    throw new Error('guild is unavailable');
  }

  const usersActivitiesDiscord = await getUsersActivitiesNowFromDiscord(
    message
  );

  if (usersActivitiesDiscord == undefined) {
    throw new Error('usersActivitiesDiscord is undefined');
  }

  for (const userActivitiesDiscord of usersActivitiesDiscord) {
    if (await isUserActivitiesInDB(userActivitiesDiscord.user.id)) {
      const userActivitiesDB = await getUserActivitiesFromDB(
        userActivitiesDiscord.user.id
      );
      for (const activityDiscord of userActivitiesDiscord.activities) {
        addGuildIdToUserActivitiesSchema(message.guild.id, userActivitiesDB!);
        if (doesUserHaveActivity(activityDiscord.name, userActivitiesDB!)) {
          await updateUserActivitiesDBActivity(
            activityDiscord,
            userActivitiesDB!
          );
        } else {
          // addActivityToUserActivities has to be tested
          addActivityToUserActivities(activityDiscord, userActivitiesDB!);
        }
      }
    } else {
      await addUserActivitiesToDB(message.guild.id, userActivitiesDiscord);
    }
  }

  if (interval) {
    console.log('Users Activities UPDATED');
  } else {
    const usersActivitiesDB = await getUsersActivitiesFromGuildFromDB(
      message.guild.id
    );

    const myTable = getTable(usersActivitiesDB);

    fs.writeFileSync(
      'image.png',
      text2png(table(myTable), {
        font: '32px Courier New',
        color: 'white',
        strokeWidth: 2,
      })
    );

    await message.channel.send({ files: ['image.png'] });
  }
}

function getTable(usersActivities: IUserActivities[]) {
  const table: ITable = [[null]];
  for (const i of usersActivities) {
    addRow(i.user.name, table);
    for (const activity of i.activities) {
      const abbreviatedActivity = abbreviateActivity(activity.name);
      if (!isActivityInTable(abbreviatedActivity, table)) {
        addColumn(abbreviatedActivity, table);
      }
      const indexUser = getIndexUser(i.user.name, table);
      const indexActivity = getIndexActivity(abbreviatedActivity, table);
      const { h, m, s } = secondsToTime(activity.duration);
      table[indexUser][indexActivity] = `${formatTime(h)}:${formatTime(
        m
      )}:${formatTime(s)}`;
    }
  }
  formatTable(table);
  return table;
}

function addGuildIdToUserActivitiesSchema(
  guildIdNew: Snowflake,
  userActivities: IUserActivitiesSchema
) {
  let found = false;

  for (const guildId of userActivities.guildsId) {
    if (guildId === guildIdNew) {
      found = true;
      break;
    }
  }
  if (found === false) {
    userActivities.guildsId.push(guildIdNew);
  }
}

async function getUsersActivitiesFromGuildFromDB(guildId: Snowflake) {
  return await UserActivities.find({ guildsId: { $in: [guildId] } }, (err) => {
    if (err) console.log(err);
  });
}

async function getUsersActivitiesNowFromDiscord(message: Message) {
  if (message.guild == undefined) {
    throw new Error('property guild of message parameter is undefined');
  }

  if (!message.guild.available) {
    throw new Error('guild is unavailable');
  }

  const response: IUserActivities[] = [];

  const members = await message.guild.members.fetch().then((members) => {
    return members.array();
  });

  for (const member of members) {
    const user = member.user;

    if (!isUserOffline(user) && !isUserBot(user)) {
      const userActivities = {
        user: { name: user.username, id: user.id },
        activities: [],
        guildId: member.guild.id,
      } as IUserActivities;

      user.presence.activities.forEach((activity) => {
        userActivities.activities.push({
          name: activity.name,
          duration: getDurationAsSeconds(activity.createdTimestamp),
        } as IActivity);
      });

      if (userActivities.activities.length !== 0) response.push(userActivities);
    }
  }

  return response;
}

function doesUserHaveActivity(
  activityNew: string,
  userActivities: IUserActivities
) {
  for (const activity of userActivities.activities) {
    if (activity.name === activityNew) {
      return true;
    }
  }
  return false;
}

function addActivityToUserActivities(
  activity: IActivity,
  userActivities: IUserActivitiesSchema
) {
  userActivities.activities.push({ ...activity, updatedAt: Date.now() });
}

async function updateUserActivitiesDBActivity(
  activityUpdated: IActivity,
  userActivities: IUserActivitiesSchema
): Promise<void> {
  for (const activity of userActivities.activities) {
    if (activity.name === activityUpdated.name) {
      const activityUpdatedDuration = activityUpdated.duration;
      const deltaTime = getDurationAsSeconds(activity.updatedAt);

      if (activityUpdatedDuration <= deltaTime) {
        activity.duration += activityUpdatedDuration;
      } else {
        activity.duration += deltaTime;
      }

      activity.updatedAt = Date.now();
    }
  }

  await UserActivities.findOneAndUpdate(
    { 'user.id': userActivities.user.id },
    userActivities
  );
}

async function addUserActivitiesToDB(
  guildId: Snowflake,
  userActivities: IUserActivities
): Promise<void> {
  const newUserActivities = new UserActivities();

  newUserActivities.user = userActivities.user;

  newUserActivities.activities = (() => {
    const array: IActivitySchema[] = [];
    for (const activity of userActivities.activities) {
      array.push({ ...activity, updatedAt: Date.now() });
    }
    return array;
  })();

  newUserActivities.guildsId = new Array(guildId);
  newUserActivities.updatedAt = Date.now();

  await newUserActivities.save((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('newUserActivities has been saved successfully');
    }
  });
}

async function isUserActivitiesInDB(userId: Snowflake) {
  const userActivities = await UserActivities.findOne(
    { 'user.id': userId },
    (err, userActivities) => {
      if (err) {
        console.log(err);
      } else {
        return userActivities;
      }
    }
  );
  if (userActivities == undefined) return false;
  return true;
}

async function getUserActivitiesFromDB(userId: Snowflake) {
  return await UserActivities.findOne(
    { 'user.id': userId },
    (err, userActivities) => {
      if (err) {
        console.log(err);
      } else {
        return userActivities;
      }
    }
  );
}
