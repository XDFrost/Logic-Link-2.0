import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export type PingData = SlashCommandBuilder;
export type PingExecute = (interaction: CommandInteraction) => Promise<void>;