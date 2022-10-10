import manifest from "../package.json";

export const APP_VERSION = manifest.version;
export const DEBUG = false;

// Control values for API
export const API_DOMAIN = "https://live.api.novastudios.uk"; /* http://, https:// */
export const WEBSOCKET_DOMAIN = "wss://live.api.novastudios.uk"; /* ws:// wss:// */
