const { runGetActivities } = require('../getActivities');

let interval;

module.exports.startGetActivities = (message, timer) => {
  interval = setInterval(
    (message) => {
      runGetActivities(message, false);
    },
    timer,
    message
  );
};

module.exports.stopGetActivities = () => {
  clearInterval(interval);
};
