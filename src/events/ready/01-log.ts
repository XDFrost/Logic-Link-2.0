import { onLoginEvent } from "./ready.types";

const onlogin : onLoginEvent = (client) => {
    client.on("ready", () => {
        console.log(`Logged in as ${client.user?.tag}`);
    })
}

export default onlogin;