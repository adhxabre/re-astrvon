"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const event = {
    name: 'ready',
    once: true,
    async execute(client) {
        if (!client.user) {
            console.log('re-astrvon | Bot is ready, but client.user is undefined!');
            return;
        }
        console.log(`re-astrvon | Bot is now logged in as ${client.user.tag} and online!`);
        // Set the bot's presence
        client.user.setPresence({
            activities: [{ name: 'in development | @astrvon', type: discord_js_1.ActivityType.Streaming, url: "https://patchoulegs.my.id/" }],
            status: 'dnd',
        });
        // Optional: Log the current status
        console.log(`re-astrvon | Bot status set to: ${client.user.presence.status}`);
    }
};
exports.default = event;
