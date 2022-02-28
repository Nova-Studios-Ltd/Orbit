import { Dictionary } from "./Dictionary";

export default class NSWebsocket {
    reconnect = 1;
    timesteps = [2500, 4000, 8000, 12000];
    websocket: WebSocket;
    events: Dictionary<(...args: any) => void>;

    constructor(address: string, insecure?: boolean) {
        if (insecure !== undefined || insecure === true) {
            this.websocket = new WebSocket(`wss://${address}`);
        }
        else {
            this.websocket = new WebSocket(`ws://${address}`);
        }
        this.events = new Dictionary<(...args: any) => void>();

        this.websocket.onmessage = (data) => {
            const event = JSON.parse(data.data);
            const type = event.EventType
            delete event.EventType;
            if (this.events.containsKey())
        };
    }

    CreateEvent(event_id: string, callback: (...args: any) => void) {
        this.events.setValue(event_id, callback);
    }

    RemoveEvent(event_id: string) {
        this.events.clear(event_id);
    }
}