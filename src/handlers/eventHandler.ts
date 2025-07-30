import { fileURLToPath, pathToFileURL } from "url";
import path from "path";
import fs from "fs";
import { registerEventType, 
        eventFolderType, 
        importPromisesType } 
from "./types/eventHandler";

const registerEvents: registerEventType = async (client) => {
    const __filename = fileURLToPath(import.meta.url); 
    const __dirname = path.dirname(__filename);
    let count = 0; 
    let eventFolders: eventFolderType = [];

    try {
        const eventsRoot = path.join(__dirname, "..", "events");

        eventFolders = fs
            .readdirSync(eventsRoot, { withFileTypes: true })
            .filter((d) => d.isDirectory())
            .map((d) => d.name)
            .sort((a, b) => a.localeCompare(b));

        const importPromises: importPromisesType = [];

        for (const eventFolder of eventFolders) {
            const eventPath = path.join(eventsRoot, eventFolder);

            const eventFiles = fs
                .readdirSync(eventPath)
                .filter((file) =>
                    (file.endsWith(".js") || file.endsWith(".ts")) &&
                    !file.endsWith(".d.ts") &&
                    !file.endsWith(".types.ts") &&
                                    !file.startsWith("_") &&
                !["registerCommands.ts", "someHelperFile.ts", "commandHandler.ts"].includes(file)
                ).map((file) => path.join(eventPath, file));

            for (const eventFile of eventFiles) {
                const fileUrl = pathToFileURL(eventFile);

                const promise = import(fileUrl.href)
                    .then((eventHandler) => {
                        if (typeof eventHandler.default === "function") {
                            eventHandler.default(client);
                            count++;
                            console.log(`Registered event handler from ${eventFile}`);
                        } else {
                            console.warn(`Event handler in ${eventFile} does not export a default function.`);
                        }
                    })
                    .catch((error) => {
                        console.error(`Failed to load event handler from ${eventFile}:`, error);
                    });

                importPromises.push(promise);
            }
        }

        await Promise.all(importPromises);  // Wait for all handlers to load

    } catch (error) {
        console.error("Error during event registration:", error);
        return;
    } finally {
        console.log(`Registered ${eventFolders.length} event folders.`);
        console.log(`Total event files registered: ${count}`);
        console.log("Event registration complete.");
        console.log("Ready to handle events.\n");
    }
}

export default registerEvents;