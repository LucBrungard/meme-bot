import { Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import { BOT_TOKEN, CLIENT_ID, GUILD_ID } from "../constants.js";
import * as path from "node:path";
import * as fs from "node:fs";
import log from "npmlog";
import {fileURLToPath} from "url";
import { getDate } from "../utils/date-formatter.js";
import { exit } from "node:process";

if (!BOT_TOKEN) {
	log.error(getDate(), "BOT_TOKEN is invalid !");
	exit(1);
}
if (!CLIENT_ID) {
	log.error(getDate(), "CLIENT_ID is invalid !");
	exit(1);
}
if (!GUILD_ID) {
	log.error(getDate(), "GUILD_ID is invalid !");
	exit(1);
}

log.info(getDate(), "Deploying new commands ...");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commands = [];

const commandsPath = path.join(__dirname, process.env.NODE_ENV ?? "development");

const commandFiles = fs.readdirSync(commandsPath);

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const { command } = await import(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
	.then((data) => {
		log.info(getDate(), `Successfully registered ${(data as Array<unknown>).length} application commands.`);
	})
	.catch(console.error);
