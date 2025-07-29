import { Client } from "discord.js"

export default function onlogin(client: Client) : void {
    client.on("ready", () => {
        console.log(`Logged in as ${client.user?.tag}`);
    })
}