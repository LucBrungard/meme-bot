import { Interaction, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/command";

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Replies with user info !"),
    async execute(interaction: Interaction) {
        if (!interaction.isRepliable()) return;

        await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
    },
};
