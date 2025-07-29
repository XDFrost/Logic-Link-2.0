import { Client, Events, GatewayIntentBits } from "discord.js";
import { config } from "../config/config.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
})

client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user?.tag}`);
})

client.login(config.token);