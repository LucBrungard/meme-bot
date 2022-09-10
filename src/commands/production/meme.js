import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import * as path from "node:path";
import * as fs from "node:fs";
import { MEME_FOLDER } from "../../constants.js";

const memesPath = path.join(process.cwd(), MEME_FOLDER);
let files = fs.readdirSync(memesPath);

// Reset files from list
setInterval(() => {
	files = [];
	files = fs.readdirSync(memesPath);
}, 1000 * 60 * 60 * 24);

export const command = {
	data: new SlashCommandBuilder()
		.setName("meme")
		.setDescription("Reply with a meme as image !"),
	async execute(interaction) {
		// Generate random index from 0 to files lengths
		const idx = Math.floor(Math.random() * files.length);
		const meme = files[idx];

		// remove meme from list
		files.splice(idx, 1);

		const file = new AttachmentBuilder(path.join(memesPath, meme));

		await interaction.reply({ files: [file] });
	},
};

