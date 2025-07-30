export type commandHandlerType = (client : any) => Promise<void>;
export type findCommandFilesType = (dir: string) => string[];