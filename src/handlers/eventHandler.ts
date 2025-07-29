import { Client } from "discord.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

export default function registerEvents(client: Client) : void {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const eventsRoot = path.join(__dirname, "..", "events");
    
    // Find sub‑folders (one per event name)
    const eventFolders = fs
        .readdirSync(eventsRoot, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .sort((a, b) => a.localeCompare(b));

    // Iterate through each event folder
    for (const eventFolder of eventFolders) {
        const eventPath = path.join(eventsRoot, eventFolder);
        
        // cache the event file
        const eventFiles = fs
            .readdirSync(eventPath)
            .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
            .map((file) => path.join(eventPath, file)); 

        // Iterate through each event file
        for (const eventFile of eventFiles) {
            // Import the event handler
            import(eventFile)
                .then((eventHandler) => {
                    if (typeof eventHandler.default === "function") {
                        // Call the event handler with the client
                        eventHandler.default(client);
                    } else {
                        console.warn(`Event handler in ${eventFile} does not export a default function.`);
                    }
                })
                .catch((error) => {
                    console.error(`Failed to load event handler from ${eventFile}:`, error);
                });
        }
    }

    console.log(`\nRegistered ${eventFolders.length} event folders and their respective handlers.`);
    console.log(`Total event files registered: ${eventFolders.reduce((acc, folder) => {
        const eventPath = path.join(eventsRoot, folder);
        return acc + fs.readdirSync(eventPath).filter((file) => file.endsWith(".js") || file.endsWith(".ts")).length;
    }, 0)}`);
    console.log("Event registration complete.");
    console.log("Ready to handle events.\n");
}