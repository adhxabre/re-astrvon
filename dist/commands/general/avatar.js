"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Display the avatar of user.')
        .addUserOption(option => option
        .setName('user')
        .setDescription('The user whose avatar to show')
        .setRequired(false)),
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand())
            return;
        await interaction.deferReply();
        const targetUser = interaction.options.getUser('user') || interaction.user;
        const member = interaction.guild?.members.cache.get(targetUser.id);
        if (!member) {
            await interaction.editReply('User not found on this server.');
            return;
        }
        const embed = new discord_js_1.EmbedBuilder()
            .setColor('#0099FF')
            .setAuthor({
            name: 'Click here to enlarge!',
            url: member.displayAvatarURL({ size: 4096 })
        })
            .setDescription(`${member.user.tag}'s avatar.`)
            .setImage(member.displayAvatarURL({ size: 1024 }))
            .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL()
        })
            .setTimestamp();
        await interaction.editReply({ embeds: [embed] });
    }
};
exports.default = command;
