import { Interaction, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/command";

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName("server")
		.setDescription("Replies with server info!"),
	async execute(interaction: Interaction) {
		if (!interaction.isRepliable()) return;

		await interaction.reply(`Server name: ${interaction.guild?.name }\nTotal members: ${interaction.guild?.memberCount}`);
	},
};
