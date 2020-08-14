const delay = require('delay');
const moment = require('moment');
const { table } = require('table');
const { tableConfig } = require('../globals');
const Table = require('../models/table');

module.exports = async (message) => {
  let tableOldObj = await getTableOldFromDB(message.guild.id);

  if (tableOldObj === null) {
    let tableNew = [[null]];

    const usersActivities = await getUserActivities(message);

    createTable(await getUserActivities(message), tableNew);

    sendMessageTable(message, tableNew);

    await addTableToDB(tableNew, message.guild.id);

    //send to db
  } else {
    tableOld = tableOldObj.array;

    let tableNew = [[null]];

    const usersActivities = await getUserActivities(message);

    createTable(await getUserActivities(message), tableNew);

    let tableCombined = combineTables(tableOldObj, tableNew);

    await addTableToDB(tableCombined, message.guild.id);

    sendMessageTable(message,tableCombined);
  }
};

function sendMessageTable(message, tableArray) {
  message.channel.send('`\n' + table(tableArray, tableConfig) + '`');
}

async function getTableOldFromDB(guildId) {
  return await Table.findOne(
    { guildId: guildId },
    {},
    { sort: { createdAt: -1 } },
    (err, table) => {
      if (err) {
        console.log(err);
      } else {
        return table;
      }
    }
  );
}

async function getUserActivities(message) {
  const response = [];

  // get members of guild as an array
  let members = await message.guild.members.fetch();
  members = members.array();

  for (const member of members) {
    const user = member.user;
    // check if user is not offline and not a bot
    if (!isUserOffline(user) && !isUserBot(user)) {
      user.presence.activities.forEach((activity) => {
        const username = user.username;

        response.push({
          user: username,
          activity: abbreviateActivityName(activity.name),
          duration: getDurationAsSeconds(activity.createdTimestamp),
        });
      });
    }
  }

  return response;
}

function isUserOffline(user) {
  return user.presence.status === 'offline';
}

function isUserBot(user) {
  return user.bot === true;
}

function abbreviateActivityName(activityName) {
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

function getDurationAsSeconds(timestamp) {
  const now = moment(new Date());
  const start = moment(timestamp);

  const duration = moment.duration(now.diff(start));
  return duration.asSeconds();
}

function createTable(usersActivities, table) {
  addActivitiesToTable(usersActivities, table);
  addUsersToTable(usersActivities, table);

  addDataToTable(usersActivities, table);
}

function addActivitiesToTable(usersActivities, table) {
  for (const activity of usersActivities) {
    let indexName;

    if (table[0].indexOf(activity.activity) === -1) {
      table[0].push(activity.activity);
    }
  }
}

function addUsersToTable(usersActivities, table) {
  const numberOfColumns = table[0].length;

  for (const activity of usersActivities) {
    if (!isUserInTable(activity.user, table)) {
      const arr = [];
      arr.push(activity.user);

      for (let i = 1; i <= numberOfColumns - 1; i++) {
        arr.push(null);
      }

      table.push(arr);
    }
  }
}

function isUserInTable(user, table) {
  for (const [index, row] of table.entries()) {
    if (index !== 0) {
      if (row[0] === user) {
        return true;
      }
    }
  }
  return false;
}

function isActivityInTable(activity, table) {
  if (table[0].indexOf(activity) === -1) {
    table[0].push(activity);
  }
}

async function addDataToTable(userActivities, table) {
  for (const activity of userActivities) {
    const indexUser = getIndexUser(activity.user, table);
    const indexActivity = getIndexActivity(activity.activity, table);

    const formatted = moment.utc(activity.duration * 1000).format('HH:mm:ss');

    table[indexUser][indexActivity] = formatted;
  }
  // await addTableToDB(table, guildId);
}

function getIndexActivity(activity, table) {
  return table[0].indexOf(activity);
}

function getIndexUser(user, table) {
  for (const [rowNumber, row] of table.entries()) {
    if (rowNumber !== 0) {
      if (row[0] === user) {
        return rowNumber;
      }
    }
  }
}

function combineTables(tableOldObj, tableNew) {
  let tableCombined = tableOldObj.array;

  const usersNew = [];
  const activitiesNew = [];

  for (let i = 1; i < tableNew[0].length; i++) {
    const activityNew = tableNew[0][i];
    activitiesNew.push(activityNew);

    if (!isActivityInTable(activityNew, tableCombined)) {
      addActivityToTable(activityNew, tableCombined);
    }
  }

  for (const [index, row] of tableNew.entries()) {
    if (index !== 0) {
      const userNew = row[0];
      usersNew.push(userNew);

      if (!isUserInTable(userNew, tableCombined)) {
        addUserToTable(userNew, tableCombined);
      }
    }
  }

  formatTable(tableCombined);

  for (const userNew of usersNew) {
    for (const activityNew of activitiesNew) {
      const indexUserNew = getIndexUser(userNew, tableNew);
      const indexActivityNew = getIndexActivity(activityNew, tableNew);

      const indexUserCombined = getIndexUser(userNew, tableCombined);
      const indexActivityCombined = getIndexActivity(
        activityNew,
        tableCombined
      );

      const durationNew = tableNew[indexUserNew][indexActivityNew];
      const durationCombined =
        tableCombined[indexUserCombined][indexActivityCombined];

      const durationNewSeconds = moment(durationNew, 'HH:mm:ss').diff(
        moment().startOf('day'),
        'seconds'
      );

      const deltaTimestamp = getDurationAsSeconds(tableOldObj.createdAt);

      if (
        durationCombined === null ||
        durationCombined === ' ' ||
        durationCombined === '' ||
        durationCombined === undefined
      ) {
        tableCombined[indexUserCombined][indexActivityCombined] =
          tableNew[indexUserNew][indexActivityNew];
      } else if (durationNewSeconds <= deltaTimestamp) {
        tableCombined[indexUserCombined][indexActivityCombined] = moment(
          durationCombined,
          'HH:mm:ss'
        )
          .add(durationNewSeconds, 'seconds')
          .format('HH:mm:ss');
      } else if (durationNewSeconds > deltaTimestamp) {
        tableCombined[indexUserCombined][indexActivityCombined] = moment(
          durationCombined,
          'HH:mm:ss'
        )
          .add(deltaTimestamp, 'seconds')
          .format('HH:mm:ss');
      }
    }
  }

  return tableCombined;
}

function addUserToTable(user, table) {
  const numberOfColumns = table[0].length;

  if (!isUserInTable(user, table)) {
    const arr = [];
    arr.push(user);

    for (let i = 1; i <= numberOfColumns - 1; i++) {
      arr.push(null);
    }

    table.push(arr);
  }
}

function addActivityToTable(activity, table) {
  if (table[0].indexOf(activity) === -1) {
    table[0].push(activity);
  }
}

function formatTable(table) {
  {
    const numberOfColumns = table[0].length;

    for (const array of table) {
      if (array.length !== numberOfColumns) {
        const diff = Math.abs(array.length - numberOfColumns);
        for (let i = 1; i <= diff; i++) {
          array.push(null);
        }
      }
    }
  }
}

async function addTableToDB(table, guildId) {
  tableModel = new Table();
  tableModel.array = table;
  tableModel.createdAt = Date.now();
  tableModel.guildId = guildId;

  await tableModel.save((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Table added to database');
    }
  });
}
