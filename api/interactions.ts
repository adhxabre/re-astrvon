import { VercelRequest, VercelResponse } from '@vercel/node';
import { InteractionType, InteractionResponseType, verifyKey } from 'discord-interactions';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { Command } from '../src/types/Command';
import { ExtendedClient } from '../src/types/ExtendedClient';
import handleCommands from '../src/functions/handlers/handleCommands';

const client: ExtendedClient = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
}) as ExtendedClient;

client.commands = new Collection<string, Command>();
client.commandArray = [];

// Initialize commands
handleCommands(client);

export default async (request: VercelRequest, response: VercelResponse) => {
    // Verify the request
    const signature = request.headers['x-signature-ed25519'];
    const timestamp = request.headers['x-signature-timestamp'];
    const rawBody = await getRawBody(request);

    const isValidRequest = verifyKey(
        rawBody,
        signature as string,
        timestamp as string,
        process.env.PUBLIC_KEY as string
    );

    if (!isValidRequest) {
        return response.status(401).send('Bad request signature');
    }

    const message = request.body;

    // Handle verification requests
    if (message.type === InteractionType.PING) {
        return response.status(200).send({
            type: InteractionResponseType.PONG,
        });
    }

    // Handle slash commands
    if (message.type === InteractionType.APPLICATION_COMMAND) {
        const { name } = message.data;
        const command = client.commands.get(name);

        if (!command) {
            return response.status(404).send({ error: 'Command not found' });
        }

        try {
            await command.execute(message, client);
            return response.status(200).send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: 'Command executed successfully!',
                },
            });
        } catch (error) {
            console.error(error);
            return response.status(500).send({ error: 'Error executing command' });
        }
    }

    response.status(400).send({ error: 'Unknown Type' });
};

// Helper function to get raw body as a buffer
async function getRawBody(req: VercelRequest): Promise<Buffer> {
    return new Promise((resolve) => {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            resolve(Buffer.from(data));
        });
    });
}