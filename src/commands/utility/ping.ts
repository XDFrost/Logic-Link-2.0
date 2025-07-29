import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import type { PingData, PingExecute } from "./ping.types.js";

export const data : PingData = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!");

export const execute : PingExecute = async (interaction) => {
    await interaction.reply("Pong!");
}