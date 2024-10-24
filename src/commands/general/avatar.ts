import {SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, CommandInteraction} from 'discord.js';
import {Command} from '../../types/Command'
import {ExtendedClient} from "../../types/ExtendedClient";

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
        const member = interaction.guild?.members.cache.get(targetUser.id)

        if (!member) {
            await interaction.editReply('User not found on this server.')
            return
        }

        const embed = new EmbedBuilder()
            .setColor('#0099FF')
            .setAuthor({
                name: 'Click here to enlarge!',
                url: member.displayAvatarURL({size: 4096})
            })
            .setDescription(`${member.user.tag}'s avatar.`)
            .setImage(member.displayAvatarURL({size: 1024}))
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();

        await interaction.editReply({embeds: [embed]})
    }
}

export default command;