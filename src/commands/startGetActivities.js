const {
  startGetActivities,
} = require('./intervalGetActivities/intervalGetActivities');

module.exports = (message, timerMinute) => {
  const defaultTimerMinute = 3;

  if (timerMinute === undefined) {
    timerMinute = defaultTimerMinute;
  }

  const timer = timerMinute * 60 * 1000;

  message.reply(
    `Get activity interval started, running every ${getMinuteString(
      timerMinute
    )}`
  );

  startGetActivities(message, timer);
};

function getMinuteString(minute) {
  if (minute <= 1) {
    return `${minute} minute`;
  } else {
    return `${minute} minutes`;
  }
}
