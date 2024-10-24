import {VercelRequest, VercelResponse} from '@vercel/node';
import dotenv from 'dotenv';
import {Client, GatewayIntentBits, Collection} from 'discord.js';
import {Command} from '../src/types/Command';
import {ExtendedClient} from '../src/types/ExtendedClient';
import {handleEvents} from '../src/functions/handlers/handleEvents';
import {handleCommands} from '../src/functions/handlers/handleCommands';

dotenv.config();

const client: ExtendedClient = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
}) as ExtendedClient;

client.commands = new Collection<string, Command>();
client.commandArray = [];

// Initialize bot
let isInitialized = false;

async function initializeBot() {
    if (!isInitialized) {
        await handleEvents(client);
        await handleCommands(client);
        await client.login(process.env.TOKEN);
        console.log('Bot is logged in.');
        isInitialized = true;
    }
}

export default async (request: VercelRequest, response: VercelResponse) => {
    try {
        await initializeBot();
        response.status(200).json({status: 'Bot is running!'});
    } catch (error) {
        console.error('Error initializing bot:', error);
        response.status(500).json({status: 'Error initializing bot', error: error.message});
    }
};