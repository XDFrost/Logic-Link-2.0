/* global process */
import dotenv from 'dotenv';

dotenv.config({ path: ["./envs/.env.dev"] });

export const config = {
    appID: process.env.appID || "",
    publicKey: process.env.publicKey || "",
    clientID: process.env.clientID || "",
    token: process.env.token || "",
};