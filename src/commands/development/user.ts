import { Interaction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Replies with user info !"),
    async execute(interaction: Interaction) {
        if (!interaction.isRepliable()) return;

        await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
    },
};
