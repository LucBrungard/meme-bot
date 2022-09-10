import { Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import { BOT_TOKEN, CLIENT_ID, GUILD_ID } from "../constants.js";

const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

// for guild-based commands
rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: [] })
	.then(() => console.log("Successfully deleted all guild commands."))
	.catch(console.error);
