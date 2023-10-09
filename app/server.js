import TelegramBot from 'node-telegram-bot-api';
import commandsInit from './commands/commands.js';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const token = process.env.TOKEN;
if (!token) {
    console.log('Token not found.');
} else {
    const bot = new TelegramBot(token, { polling: true });

    commandsInit(bot);
}
