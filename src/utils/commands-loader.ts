import * as path from "node:path";
import * as fs from "node:fs";
import { Command } from "../types/command";

export async function loadCommands(): Promise<Command[]> {
    const commandsPath = path.join(__dirname, "..", "commands", process.env.NODE_ENV ?? "development");
    const commandFiles = fs.readdirSync(commandsPath);

    if (commandFiles.length === 0) {
        throw new Error("No command was found !");
    }
    
    const res: Command[] = [];

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command: Command = (await import(filePath)).default;
        res.push(command);
    }

    return res;
}