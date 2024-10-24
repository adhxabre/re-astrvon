"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const discord_js_1 = require("discord.js");
dotenv_1.default.config();
const client = new discord_js_1.Client({
    intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMembers],
});
client.commands = new discord_js_1.Collection();
client.commandArray = [];
const functionFolders = fs_1.default.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
    const functionFiles = fs_1.default
        .readdirSync(`./src/functions/${folder}`)
        .filter(f => f.endsWith('.ts'));
    for (const file of functionFiles) {
        const functionModule = require(`./functions/${folder}/${file}`);
        if (typeof functionModule === 'function') {
            functionModule(client);
        }
        else if (typeof functionModule.default === 'function') {
            functionModule.default(client);
        }
        else {
            console.error(`File ${file} does not export a function`);
        }
    }
}
client.handleEvents();
client.handleCommands();
client.login(process.env.TOKEN).then(() => console.log('Bot is logged in.'));
