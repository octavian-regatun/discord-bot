module.exports = (message) => {
  const {
    stopGetActivities,
  } = require('./intervalGetActivities/intervalGetActivities');

  stopGetActivities;

  message.reply('Get activity interval stopped');
};
