import * as path from "node:path";
import * as fs from "node:fs";

describe("Commands fields", () => {
    const commandsPath = path.join(__dirname, "..", "commands", process.env.NODE_ENV ?? "development");
    const commandFiles = fs.readdirSync(commandsPath);

    for (const commandFile of commandFiles) {
        expect.assertions(2);
        describe(`Command ~${commandFile}~`, () => {
            const filePath = path.join(commandsPath, commandFile);
            test("Should have data field", () => {
                import(filePath)
                    .then(commandModule => {
                        const command = commandModule.default;
                        expect(command.data).toBeDefined();
                    });
            });

            test("Should have execute field", () => {
                import(filePath)
                    .then(commandModule => {
                        const command = commandModule.default;
                        expect(command.data).toBeDefined();
                    });
            });
        });
        
            
    }
});
