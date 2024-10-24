import {SlashCommandBuilder, CommandInteraction} from 'discord.js';
import {ExtendedClient} from '../../types/ExtendedClient';
import {Command} from '../../types/Command';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Giving information of your ping.')
        .setNSFW(false),
    async execute(interaction: CommandInteraction, client: ExtendedClient) {
        const message = await interaction.deferReply({fetchReply: true});
        const newMessage = `API Latency: ${client.ws.ping}\nClient Ping: ${message.createdTimestamp - interaction.createdTimestamp}`;
        await interaction.editReply({content: newMessage});
    },
}

export default command;