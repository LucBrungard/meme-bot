import { Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import { BOT_TOKEN, CLIENT_ID, GUILD_ID } from "../constants.js";
import log from "npmlog";
import { getDate } from "../utils/date-formatter.js";
import { exit } from "process";

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

log.info(getDate(), "Deleting commands ...");

const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

// for guild-based commands
rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: [] })
    .then(() => log.info(getDate(), "Successfully deleted all guild commands."))
    .catch((err) => log.error(getDate(), err));
