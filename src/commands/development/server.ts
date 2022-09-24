import { Interaction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("server")
        .setDescription("Replies with server info!"),
    async execute(interaction: Interaction) {
        if (!interaction.isRepliable()) return;

        await interaction.reply(`Server name: ${interaction.guild?.name }\nTotal members: ${interaction.guild?.memberCount}`);
    },
};
