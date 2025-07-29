/* global process */
import dotenv from 'dotenv';
import { Config } from './config.types';

dotenv.config({ path: ["./envs/.env.dev"] });

export const config : Config = {
    appID: process.env.appID || "",
    publicKey: process.env.publicKey || "",
    clientID: process.env.clientID || "",
    token: process.env.token || "",
};