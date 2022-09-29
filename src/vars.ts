import manifest from "../package.json";

export const APP_VERSION = manifest.version;
export const DEBUG = false;

// Control values for API
export const API_DOMAIN = "https://api.novastudios.uk"; /* http://, https:// */
export const WEBSOCKET_DOMAIN = "wss://api.novastudios.uk"; /* ws:// wss:// */
