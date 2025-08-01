import { MessageFlags, SlashCommandBuilder } from "discord.js";
import ICommand from "../types/CommandClient.js";

const pingCommand: ICommand = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    
    execute: async (interaction) => {
        try {
            
            if (!interaction.isRepliable()) {
                console.error("Interaction is no longer repliable");
                return;
            }
            const r : number = Math.random()
            r > 0.02        // 2% chance to get secret pong
            ?
            await interaction.reply({
                content:"Pong!"
            })
            :
            await interaction.reply({
                content:"Secret Pong!",
                flags: MessageFlags.Ephemeral
            })

        } catch (error) {
            // Only log, do not re-throw
            console.error("Error in ping command:", error);
            // Optionally, try to follow up if possible
            if (interaction.isRepliable() && !(interaction.replied || interaction.deferred)) {
                try {
                    await interaction.reply({ content: "There was an error executing the command.", ephemeral: true });
                } catch (e) {
                    // Ignore further errors
                }
            }
        }
    }
};

export default pingCommand;  