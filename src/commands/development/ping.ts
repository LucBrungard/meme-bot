import { SlashCommandBuilder, Interaction } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong !"),
    async execute(interaction: Interaction) {
        if (!interaction.isRepliable()) return;

        await interaction.reply("Pong !");
    },
};