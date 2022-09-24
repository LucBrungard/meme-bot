import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import log from "npmlog";
import { exit } from "node:process";
import { BOT_TOKEN, CLIENT_ID, GUILD_ID } from "../constants";
import { getDate } from "../utils/date-formatter";
import { loadCommands } from "../utils/commands-loader";
import { formatLogger } from "../utils/logger-formatter";

formatLogger();

log.infoV2("Deploying new commands ...");

const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];

loadCommands()
    .then((co) => {
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
        
        for (const command of co) {
            commands.push(command.data.toJSON());
        }

        const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

        rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
            .then((data) => {
                log.info(getDate(), `Successfully registered ${(data as Array<unknown>).length} application commands.`);
            })
            .catch(console.error);
    })
    .catch((err: Error) => {
        log.errorV2(err.message);
        console.error(err);
    });

