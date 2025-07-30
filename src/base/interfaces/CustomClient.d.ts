import { config } from '../../config/config.js';
import { Collection } from "discord.js";

export default interface ICustomClient {
    config: typeof config;
    commands: Collection<string, any>;
    Init(): Promise<void>;
}