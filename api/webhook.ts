import { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';
import { ExtendedClient } from '../src/types/ExtendedClient';

dotenv.config();

const client: ExtendedClient = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
}) as ExtendedClient;

// Initialize bot
let isInitialized = false;

async function initializeBot() {
    if (!isInitialized) {
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