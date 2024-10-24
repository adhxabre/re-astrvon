"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
exports.default = (client) => {
    client.handleCommands = async () => {
        const commandFolders = fs_1.default.readdirSync('./src/commands/');
        for (const folder of commandFolders) {
            const commandFiles = fs_1.default
                .readdirSync(`./src/commands/${folder}`)
                .filter((f) => f.endsWith('.ts'));
            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`).default;
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
            }
        }
        const clientId = process.env.CLIENT_ID;
        if (!clientId) {
            throw new Error('CLIENT_ID is not defined in the environment variables');
        }
        const rest = new discord_js_1.REST({ version: '10' }).setToken(process.env.TOKEN || '');
        try {
            console.log("re-astrvon | Start refreshing application (/) commands.");
            await rest.put(discord_js_1.Routes.applicationCommands(clientId), {
                body: client.commandArray,
            });
            console.log("re-astrvon | Successfully reloaded application (/) commands.");
        }
        catch (err) {
            console.error(err);
        }
    };
};
