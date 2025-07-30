import { Client, GatewayIntentBits, Collection } from "discord.js";
import ICustomClient from "../interfaces/CustomClient.js";
import { config } from "../../config/config.js";
import registerEvents from "../../handlers/eventHandler.js";
import commandHandler from "../../handlers/commandHandler.js";

export default class CustomClient extends Client implements ICustomClient {
    config: typeof config;
    commands: Collection<string, any>;

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages
            ]
        })
        
        this.config = config;
        this.commands = new Collection();
    }  

    async Init(): Promise<void> {
        try {
            await registerEvents(this);
            await commandHandler(this);
            this.login(this.config.token)
        }
        catch (error) {
            console.error("Error during initialization:", error);
        }
    }
}

