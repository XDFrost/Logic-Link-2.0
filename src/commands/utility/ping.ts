import { SlashCommandBuilder } from "discord.js";
import type { PingData, PingExecute } from "./types/ping.js";

export const data : PingData = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!");

export const execute : PingExecute = async (interaction) => {
    await interaction.reply("Pong!");
}  