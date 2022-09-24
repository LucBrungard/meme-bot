import { Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import log from "npmlog";
import { exit } from "process";
import { BOT_TOKEN, CLIENT_ID, GUILD_ID } from "../constants";
import { formatLogger } from "../utils/logger-formatter";

formatLogger();

if (!BOT_TOKEN) {
    log.errorV2("BOT_TOKEN is invalid !");
    exit(1);
}
if (!CLIENT_ID) {
    log.errorV2("CLIENT_ID is invalid !");
    exit(1);
}
if (!GUILD_ID) {
    log.errorV2("GUILD_ID is invalid !");
    exit(1);
}

log.infoV2("Deleting commands ...");

const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

// for guild-based commands
rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: [] })
    .then(() => log.infoV2("Successfully deleted all guild commands."))
    .catch((err) => log.errorV2(err));
