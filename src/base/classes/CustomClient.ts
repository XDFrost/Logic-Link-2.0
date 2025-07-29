import { Client } from "discord.js";
import ICustomClient from "../interfaces/ICustomClient.js";
import { config } from "../../config/config.js";
import registerEvents from "../../handlers/eventHandler.js";

export default class CustomClient extends Client implements ICustomClient {
    config: typeof config;

    constructor() {
        super({
            intents: []
        })
        
        this.config = config;
    }  

    Init(): void {
        try {
            registerEvents(this);
            this.login(this.config.token)
        }
        catch (error) {
            console.error("Error during initialization:", error);
        }
    }
}

