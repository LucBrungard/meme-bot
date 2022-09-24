// Require the necessary discord.js classes
import { Client, Collection, GatewayIntentBits } from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";
import log from "npmlog";
import { RequestInfo, RequestInit } from "node-fetch";
import { exit } from "node:process";
import { Command } from "./types/command";
import { Extentions } from "./types/extensions";
import { formatLogger } from "./utils/logger-formatter";
import { BOT_TOKEN, MEME_FOLDER, TRANSFERT_CHANNEL_ID } from "./constants";
import { getDate } from "./utils/date-formatter";
import { loadCommands } from "./utils/commands-loader";

const fetch = (url: RequestInfo, init?: RequestInit) =>
    import("node-fetch").then(({ default: fetch }) => fetch(url, init));

formatLogger();

log.infoV2("Creating new client ...");
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});
log.infoV2("Client created with success !");

// Create custom property
log.infoV2("Loading commands ...");
client.commands = new Collection();
// Get commands from commands folder according to dev phase
loadCommands()
    .then((commands) => {
        for (const command of commands) {
            client.commands.set(command.data.name, command);
        }
    })
    .catch((err: Error) => {
        log.errorV2(err.message);
        exit(1);
    });
log.infoV2("Commands have been registered with success !");


// When the client is ready, run this code (only once)
client.once("ready", () => {
    const activity = process.env.NODE_ENV ?? "development";
    client.user?.setPresence({
        activities: [{ name: `In ${activity}`, type: undefined }],
        status: "dnd",
    });

    log.infoV2("Ready !");
});


// Download new image posted in "memes" channel
client.on("messageCreate", (message) => {
    if (message.channelId !== TRANSFERT_CHANNEL_ID) return;
    if (message.attachments.size === 0) return;
    if (message.author.bot) return;
		
    log.registerV2(`Message from ${message.author.tag} to register ${message.attachments.size} image(s)`);

    message.attachments.forEach(async (obj) => {
        const attachName = obj.attachment.toString();
        const ext = attachName.substring(attachName.lastIndexOf("."));
        if (ext in Extentions) {
            try {
                const fileContent = await fetch(obj.url);
                const filePath = path.join(process.cwd(), MEME_FOLDER, `${obj.id}${ext}`);
	
                const dest = fs.createWriteStream(filePath);
                fileContent.body?.pipe(dest);
	
                log.registerV2(`   => ${obj.id}${ext} has been registered`);
            } catch(err) {
                log.errorV2(`   An error has occured while trying to fetch ${obj.url} : ${err}`);
            }
        }
    });
});


client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command: Command | undefined = interaction.client.commands.get(interaction.commandName);

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
