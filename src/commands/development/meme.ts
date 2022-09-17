import { SlashCommandBuilder, AttachmentBuilder, Interaction } from "discord.js";
import * as path from "node:path";
import * as fs from "node:fs";
import { MEME_FOLDER } from "../../constants.js";
import { Command } from "../../types/command.js";

const memesPath = path.join(process.cwd(), MEME_FOLDER);
let files = fs.readdirSync(memesPath);

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName("meme")
		.setDescription("Reply with a meme as image !"),
	async execute(interaction: Interaction) {
		if (!interaction.isRepliable()) return;
		
		// Generate random index from 0 to files lengths
		if (files.length === 0) {
			interaction.reply("No more memes in folder ! I'm refueling chief !");
			files = fs.readdirSync(memesPath);
			return;
		}

		const idx = Math.floor(Math.random() * files.length);
		const meme = files[idx];

		// remove meme from list
		files.splice(idx, 1);

		const file = new AttachmentBuilder(path.join(memesPath, meme));

		await interaction.reply({ files: [file] });
	},
};

