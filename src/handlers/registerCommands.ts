import { fileURLToPath, pathToFileURL } from "url";
import path from "path";
import fs from "fs";
import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { registerCommandsType } from "./types/registerCommands";
import { config } from "../config/config.ts";

const registerCommands: registerCommandsType = async () => {  
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const commands: SlashCommandBuilder[] = [];
    let count = 0;

    try {
        const commandsRoot = path.join(__dirname, "..", "commands");
        
        // Recursively find all command files
        const findCommandFiles = (dir: string): string[] => {
            const files: string[] = [];
            const items = fs.readdirSync(dir, { withFileTypes: true });

            for (const item of items) {
                const fullPath = path.join(dir, item.name);
                if (item.isDirectory()) {
                    files.push(...findCommandFiles(fullPath));
                } else if (
                    (item.name.endsWith(".js") || item.name.endsWith(".ts")) &&
                    !item.name.endsWith(".d.ts") &&
                    !item.name.endsWith(".types.ts") &&
                    !item.name.startsWith("_")
                ) {
                    files.push(fullPath);
                }
            }
            return files;
        };

        const commandFiles = findCommandFiles(commandsRoot);

        // Import and collect all commands
        for (const commandFile of commandFiles) {
            try {
                const fileUrl = pathToFileURL(commandFile);
                const commandModule = await import(fileUrl.href);

                // Handle both default export and named exports
                const command = commandModule.default || commandModule;

                if (command && command.data && command.data instanceof SlashCommandBuilder) {
                    commands.push(command.data);
                    count++;
                    console.log(`Loaded command: ${command.data.name} from ${commandFile}`);
                } else {
                    console.warn(`Command file ${commandFile} does not export a valid SlashCommandBuilder as 'data'`);
                }
            } catch (error) {
                console.error(`Failed to load command from ${commandFile}:`, error);
            }
        }

        // Register commands with Discord
        if (commands.length > 0) {
            const rest = new REST({ version: "10" }).setToken(config.token);

            try {
                console.log(`Started refreshing ${commands.length} application (/) commands.`);

                // Register commands globally
                const data = await rest.put(
                    Routes.applicationCommands(config.clientID),
                    { body: commands.map(cmd => cmd.toJSON()) }
                );

                console.log(`Successfully reloaded ${Array.isArray(data) ? data.length : 0} application (/) commands.`);
            } catch (error) {
                console.error("Error registering commands with Discord:", error);
            }
        }

    } catch (error) {
        console.error("Error during command registration:", error);
    } finally {
        console.log(`Loaded ${count} command files.`);
        console.log("Command registration complete.\n");
    }
};

export default registerCommands;