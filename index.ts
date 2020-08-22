import { Message } from 'discord.js';

import dotenv from 'dotenv';

import Discord from 'discord.js';
import { connectToDB } from './src/db/connectDB';

import { getActivities } from './src/commands/getActivities';

dotenv.config();

const client = new Discord.Client();

const PREFIX = process.env.PREFIX || '$';

client.on('ready', () => {
  console.log('Connected to BOT');

  void connectToDB();
});

client.on('message', (message: Message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift();

  switch (command) {
    case 'help':
      void message.reply(`Comenzile disponibile sunt:\n$simp\n$getActivities`);
      break;

    case 'getActivities':
      void getActivities(message);
      break;

    case 'startGetActivities':
      // require('./src/commands/startGetActivities')(message, args[0]);
      break;

    case 'stopGetActivities':
      // require('./src/commands/stopGetActivities')(message);
      break;

    default:
      void message.reply(
        `Aceasta nu este o comandă! Pentru a vedea toate comenzile scrieți ${PREFIX}help`
      );
      break;
  }
});

void client.login(process.env.BOT_TOKEN);
