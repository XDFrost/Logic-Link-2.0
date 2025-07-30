import { fileURLToPath, pathToFileURL } from "url";
import path from "path";
import fs from "fs";
import { Interaction } from "discord.js";
import { commandHandlerType, findCommandFilesType } from "./commandHandler.types";

const commandHandler : commandHandlerType = async (client) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    client.commands = client.commands || new Map();
    const commands = client.commands;

    // Recursively find all command files
    const findCommandFiles : findCommandFilesType = (dir) => {
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

    const commandsRoot = path.join(__dirname, "..", "commands");
    const commandFiles = findCommandFiles(commandsRoot);

    // Load all commands into memory
    for (const commandFile of commandFiles) {
        try {
            const fileUrl = pathToFileURL(commandFile);
            const commandModule = await import(fileUrl.href);

            if (commandModule.data && commandModule.execute) {
                commands.set(commandModule.data.name, commandModule);
                console.log(`Loaded command handler: ${commandModule.data.name}`);
            }
        } catch (error) {
            console.error(`Failed to load command handler from ${commandFile}:`, error);
        }
    }

    // Handle interaction events
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing command ${interaction.commandName}:`, error);
            
            const errorMessage = "There was an error while executing this command!";
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: errorMessage, ephemeral: true });
            } else {
                await interaction.reply({ content: errorMessage, ephemeral: true });
            }
        }
    });
};

export default commandHandler; 