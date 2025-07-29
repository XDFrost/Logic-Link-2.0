import { config } from '../../config/config.js';

export default interface ICustomClient {
    config: typeof config;
    Init(): void;
}