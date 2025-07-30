import { Client } from "discord.js";

export type registerEventType = (client: Client) => Promise<void>;
export type eventFolderType = string[]
export type importPromisesType = Promise<void>[];
