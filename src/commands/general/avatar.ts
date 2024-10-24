import {SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, CommandInteraction} from 'discord.js';
import {Command} from '../../types/Command'
import {ExtendedClient} from "../../types/ExtendedClient";
import Vibrant from "node-vibrant";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Display the avatar of user.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user whose avatar to show')
                .setRequired(false)
        ) as SlashCommandBuilder,
    async execute(interaction: ChatInputCommandInteraction | CommandInteraction, client: ExtendedClient) {
        if (!interaction.isChatInputCommand()) return;
        await interaction.deferReply();

        const targetUser = interaction.options.getUser('user') || interaction.user;
        const isInGuild = interaction.guild !== null;

        const avatarUrl = targetUser.displayAvatarURL({size: 1024, forceStatic: false});
        const largeAvatarUrl = targetUser.displayAvatarURL({size: 4096, forceStatic: false});
        const dominantColor = await getDominantColor(largeAvatarUrl);

        const embed = new EmbedBuilder()
            .setColor(dominantColor)
            .setAuthor({
                name: 'Click here to enlarge!',
                url: largeAvatarUrl
            })
            .setImage(avatarUrl)
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();

        if (isInGuild) {
            if (targetUser.id === interaction.user.id) {
                embed.setDescription(`Your avatar.`);
            } else {
                embed.setDescription(`${targetUser.tag}'s avatar.`);
            }
        } else {
            embed.setDescription(`Your avatar.`);
        }

        await interaction.editReply({embeds: [embed]});
    }
}

async function getDominantColor(url: string): Promise<number> {
    try {
        const palette = await Vibrant.from(url).getPalette();
        if (palette.Vibrant) {
            return parseInt(palette.Vibrant.hex.replace('#', ''), 16);
        }
    } catch (error) {
        console.error('Error extracting color:', error);
    }
    return 0x0099FF; // Default color if extraction fails
}

export default command;