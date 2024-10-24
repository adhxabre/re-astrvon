import { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';
import fs from 'fs';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { Command } from '../src/types/Command';
import { ExtendedClient } from '../src/types/ExtendedClient';

dotenv.config();

const client: ExtendedClient = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
}) as ExtendedClient;

client.commands = new Collection<string, Command>();
client.commandArray = [];

// Initialize functions
const functionFolders = fs.readdirSync(`${process.cwd()}/src/functions`);
for (const folder of functionFolders) {
    const functionFiles = fs
        .readdirSync(`${process.cwd()}/src/functions/${folder}`)
        .filter(f => f.endsWith('.ts'));
    for (const file of functionFiles) {
        const functionModule = require(`../src/functions/${folder}/${file}`);
        if (typeof functionModule === 'function') {
            functionModule(client);
        } else if (typeof functionModule.default === 'function') {
            functionModule.default(client);
        } else {
            console.error(`File ${file} does not export a function`);
        }
    }
}

// Initialize bot
let isInitialized = false;

async function initializeBot() {
    if (!isInitialized) {
        await client.handleEvents();
        await client.handleCommands();
        await client.login(process.env.TOKEN);
        console.log('Bot is logged in.');
        isInitialized = true;
    }
}

export default async (request: VercelRequest, response: VercelResponse) => {
    try {
        await initializeBot();
        response.status(200).json({ status: 'Bot is running!' });
    } catch (error) {
        console.error('Error initializing bot:', error);
        response.status(500).json({ status: 'Error initializing bot', error: error.message });
    }
};