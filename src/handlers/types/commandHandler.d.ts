import { ICustomClient } from "../../base/interfaces/CustomClient.js";

export type commandHandlerType = (client: ICustomClient) => Promise<void>;
export type findCommandFilesType = (dir: string) => string[];