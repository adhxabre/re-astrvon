"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const node_vibrant_1 = __importDefault(require("node-vibrant"));
const command = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Display detailed information about a user.')
        .addUserOption(option => option
        .setName('user')
        .setDescription('The user to get information about')
        .setRequired(false))
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.KickMembers | discord_js_1.PermissionsBitField.Flags.BanMembers)
        .setDMPermission(false),
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand())
            return;
        await interaction.deferReply({ ephemeral: true });
        // Check if the user has moderation permissions
        if (!interaction.memberPermissions?.has(discord_js_1.PermissionsBitField.Flags.KickMembers) &&
            !interaction.memberPermissions?.has(discord_js_1.PermissionsBitField.Flags.BanMembers)) {
            await interaction.editReply({ content: 'You do not have permission to use this command.' });
            return;
        }
        const targetUser = interaction.options.getUser('user') || interaction.user;
        const member = interaction.guild?.members.cache.get(targetUser.id);
        if (!member) {
            await interaction.editReply({ content: 'User not found on this server.' });
            return;
        }
        const joinedAt = member.joinedAt ? new Date(member.joinedAt) : null;
        const createdAt = new Date(targetUser.createdAt);
        const voiceState = member.voice;
        const roles = member.roles.cache
            .filter(role => role.id !== interaction.guild?.id) // Filter out @everyone role
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, 10); // Limit to 10 roles
        const permissions = member.permissions.toArray();
        // Extract dominant color from user's avatar
        const avatarUrl = member.displayAvatarURL({ extension: 'png', size: 256 });
        const dominantColor = await getDominantColor(avatarUrl);
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(dominantColor)
            .setThumbnail(avatarUrl)
            .setAuthor({
            name: `User Information for ${member.user.tag}`,
            iconURL: avatarUrl
        })
            .addFields({ name: 'User ID', value: targetUser.id, inline: true }, { name: 'Nickname', value: member.nickname || 'None', inline: true }, { name: 'Account Created', value: `<t:${Math.floor(createdAt.getTime() / 1000)}:R>`, inline: true }, {
            name: 'Joined Server',
            value: joinedAt ? `<t:${Math.floor(joinedAt.getTime() / 1000)}:R>` : 'Unknown',
            inline: true
        }, { name: 'Roles', value: roles.join(', ') || 'None' }, { name: 'Key Permissions', value: formatPermissions(permissions) }, { name: 'Voice Status', value: formatVoiceState(voiceState) })
            .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL()
        })
            .setTimestamp();
        await interaction.editReply({ embeds: [embed] });
    }
};
function formatPermissions(permissions) {
    const keyPermissions = [
        'Administrator', 'ManageGuild', 'ManageRoles', 'ManageChannels',
        'KickMembers', 'BanMembers', 'ManageMessages', 'MentionEveryone'
    ];
    const userPermissions = permissions.filter(perm => keyPermissions.includes(perm));
    return userPermissions.length > 0 ? userPermissions.join(', ') : 'No key permissions';
}
function formatVoiceState(voiceState) {
    if (!voiceState.channel) {
        return 'Not in a voice channel';
    }
    const muteStatus = voiceState.mute ? '🔇 Muted' : '🔊 Unmuted';
    const deafStatus = voiceState.deaf ? '🔇 Deafened' : '👂 Undeafened';
    return `In ${voiceState.channel.name}\n${muteStatus}, ${deafStatus}`;
}
async function getDominantColor(url) {
    try {
        const palette = await node_vibrant_1.default.from(url).getPalette();
        if (palette.Vibrant) {
            return parseInt(palette.Vibrant.hex.replace('#', ''), 16);
        }
    }
    catch (error) {
        console.error('Error extracting color:', error);
    }
    return 0x0099FF; // Default color if extraction fails
}
exports.default = command;
