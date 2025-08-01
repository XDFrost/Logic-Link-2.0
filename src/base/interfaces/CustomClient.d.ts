import { config } from '../../config/config.js';
import { Collection } from "discord.js";
import ICommand from '../../commands/types/CommandClient.js';

export default interface ICustomClient {
    config: typeof config;
    commands: Collection<string, ICommand>;
    Init(): Promise<void>;
}