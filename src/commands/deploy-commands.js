import { Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import { BOT_TOKEN, CLIENT_ID, GUILD_ID } from "../constants.js";
import * as path from "node:path";
import * as fs from "node:fs";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commands = [];

const commandsPath = path.join(__dirname, process.env.NODE_ENV);

const commandFiles = fs.readdirSync(commandsPath);

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const { command } = await import(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);
