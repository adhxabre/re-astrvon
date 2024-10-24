"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
exports.default = (client) => {
    client.handleEvents = async () => {
        const eventFolders = fs_1.default.readdirSync(`./src/events`);
        for (const folder of eventFolders) {
            const eventFiles = fs_1.default
                .readdirSync(`./src/events/${folder}`)
                .filter((file) => file.endsWith(".ts"));
            switch (folder) {
                case "client":
                    for (const file of eventFiles) {
                        const event = require(`../../events/${folder}/${file}`).default;
                        if (event.once) {
                            client.once(event.name, (...args) => event.execute(client, ...args));
                        }
                        else {
                            client.on(event.name, (...args) => event.execute(client, ...args));
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    };
};
