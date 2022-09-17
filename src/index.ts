// Require the necessary discord.js classes
import { Client, Collection, GatewayIntentBits } from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";
import {fileURLToPath} from "url";
import fetch from "node-fetch";
import log from "npmlog";
import { BOT_TOKEN, MEME_FOLDER, TRANSFERT_CHANNEL_ID } from "./constants.js";
import { getDate } from "./utils/date-formatter.js";
import { exit } from "node:process";
import { Command } from "./types/command.js";
import { Extentions } from "./types/extensions.js";


log.enableColor();
log.addLevel("command", 10000, { fg: "yellow" });
log.addLevel("register", 10000, { fg: "blue" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

log.info(getDate(), "Creating new client ...");
const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	]
});
log.info(getDate(), "Client created with success !");

// Create custom property
log.info(getDate(), "Loading commands ...");
client.commands = new Collection();

// Get commands from commands folder according to dev phase
const commandsPath = path.join(__dirname, "commands", process.env.NODE_ENV ?? "development");
const commandFiles = fs.readdirSync(commandsPath);

if (commandFiles.length === 0) {
	log.error(getDate(), "No command was found !");
	exit(1);
}

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const { command } = await import(filePath);
	client.commands.set(command.data.name, command);
}

log.info(getDate(), "Commands have been registered with success !");

// When the client is ready, run this code (only once)
client.once("ready", () => {
	const activity = process.env.NODE_ENV ?? "development";
	client.user?.setPresence({
		activities: [{ name: `In ${activity}`, type: undefined }],
		status: "dnd",
	});

	log.info(getDate(), "Ready !");
});

// Download new image posted in "memes" channel
client.on("messageCreate", (message) => {
	if (message.channelId !== TRANSFERT_CHANNEL_ID) return;
	if (message.attachments.size === 0) return;
	if (message.author.bot) return;
		
	log.register(getDate(), `Message from ${message.author.tag} to register ${message.attachments.size} image(s)`);

	message.attachments.forEach(async (obj) => {
		const attachName = obj.attachment.toString();
		const ext = attachName.substring(attachName.lastIndexOf("."));
		if (ext in Extentions) {
			try {
				const fileContent = await fetch(obj.url);
				const filePath = path.join(process.cwd(), MEME_FOLDER, `${obj.id}${ext}`);
	
				const dest = fs.createWriteStream(filePath);
				fileContent.body?.pipe(dest);
	
				log.register(getDate(), `   => ${obj.id}${ext} has been registered`);
			} catch(err) {
				log.error(getDate(), `   An error has occured while trying to fetch ${obj.url} : ${err}`);
			}
		}
	});
});

client.on("interactionCreate", async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command: Command = interaction.client.commands.get(interaction.commandName);

	log.command(getDate(), `Command -${interaction.commandName}- has been invoked by ${interaction.user.tag}`);

	if (!command) {
		log.error(getDate(), "	=> This command doesn't exist");
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		log.error(getDate(), `An error as occurred while executing command -${interaction.commandName}-`);
		console.error(error);
	}
});

// Login to Discord with your client's BOT_TOKEN
client.login(BOT_TOKEN);
