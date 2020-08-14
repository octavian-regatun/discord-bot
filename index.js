//#region
['log', 'warn', 'error'].forEach((methodName) => {
  const originalMethod = console[methodName];
  console[methodName] = (...args) => {
    try {
      throw new Error();
    } catch (error) {
      originalMethod.apply(console, [
        error.stack // Grabs the stack trace
          .split('\n')[2] // Grabs third line
          .trim() // Removes spaces
          .substring(3) // Removes three first characters ("at ")
          .replace(__dirname, '') // Removes script folder path
          .replace(/\s\(./, ' at ') // Removes first parentheses and replaces it with " at "
          .replace(/\)/, ''), // Removes last parentheses
        '\n',
        ...args,
      ]);
    }
  };
});
//#endregion

require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

const PREFIX = process.env.PREFIX || '$';

client.on('ready', () => {
  require('./src/connectDB');

  console.log('BOT Connected!');
});

client.on('message', (message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift();

  switch (command) {
    case 'help':
      message.reply(`Comenzile disponibile sunt:\n$simp\n$getActivities`);
      break;

    case 'getActivities':
      require('./src/commands/getActivities')(message);
      break;

    default:
      message.reply(
        `Aceasta nu este o comandă! Pentru a vedea toate comenzile scrieți ${PREFIX}help`
      );
      break;
  }
});

client.login(process.env.BOT_TOKEN);
