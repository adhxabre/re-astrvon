import {ActivityType} from 'discord.js';
import {ExtendedClient} from '../../types/ExtendedClient';
import {BotEvent} from '../../types/BotEvent';

const event: BotEvent<'ready'> = {
    name: 'ready',
    once: true,
    async execute(client: ExtendedClient) {
        if (!client.user) {
            console.log('re-astrvon | Bot is ready, but client.user is undefined!');
            return;
        }

        console.log(`re-astrvon | Bot is now logged in as ${client.user.tag} and online!`);

        // Set the bot's presence
        client.user.setPresence({
            activities: [{name: 'in development | @astrvon', type: ActivityType.Streaming, url: "https://patchoulegs.my.id/"}],
            status: 'dnd',
        });

        // Optional: Log the current status
        console.log(`re-astrvon | Bot status set to: ${client.user.presence.status}`);
    }
}

export default event;