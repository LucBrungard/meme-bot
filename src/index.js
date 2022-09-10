// Require the necessary discord.js classes
import { Client, Collection, GatewayIntentBits } from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";
import {fileURLToPath} from "url";
import fetch from "node-fetch";
import { BOT_TOKEN, MEME_FOLDER, TRANSFERT_CHANNEL_ID } from "./constants.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	]
});

// Create custom property
client.commands = new Collection();

// Get commands from commands folder according to dev phase
const commandsPath = path.join(__dirname, "commands", process.env.NODE_ENV);
const commandFiles = fs.readdirSync(commandsPath);

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const { command } = await import(filePath);
	client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once("ready", () => {
	console.log("Ready!");
});

// Download new image posted in "memes" channel
client.on("messageCreate", (message) => {
	if (message.channelId === TRANSFERT_CHANNEL_ID 
        && message.attachments.size != 0
        && !message.author.bot) {

		message.attachments.forEach((obj) => {
			const idx = obj.attachment.lastIndexOf(".");
			const ext = obj.attachment.substring(idx);
			if (ext === ".png"
            || ext === ".webp"
            || ext === ".jpeg"
            || ext === ".jpg") {
				fetch(obj.url)
					.then(res => {
						const dest = fs.createWriteStream(path.join(process.cwd(), MEME_FOLDER, `${obj.id}${ext}`));
						res.body.pipe(dest);
						console.log(`${obj.id}${ext} has been registered`);
					})
					.catch((err) => {
						console.error(`An error has occured while trying to fetch ${obj.url} : `, err);
					});
			}
		});
	}
});

client.on("interactionCreate", async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: `There was an error while executing ~${interaction.commandName}~ command !`, ephemeral: true });
	}
});

// Login to Discord with your client's BOT_TOKEN
client.login(BOT_TOKEN);
