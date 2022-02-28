import IWebSocketEvent from "../Interfaces/IWebsocketEvent";
import { Dictionary } from "./Dictionary";

export default class NSWebsocket {
    reconnect = 1;
    timesteps = [2500, 4000, 8000, 12000];
    websocket: WebSocket;
    events: Dictionary<(event: IWebSocketEvent) => void>;

    constructor(address: string, insecure?: boolean) {
        if (insecure !== undefined || insecure === true) {
            this.websocket = new WebSocket(`wss://${address}`);
        }
        else {
            this.websocket = new WebSocket(`ws://${address}`);
        }
        this.events = new Dictionary<(event: IWebSocketEvent) => void>();

        this.websocket.onmessage = (data) => {
            const event = JSON.parse(data.data);
            const type = event.EventType;
            delete event.EventType;
            const ev = event as IWebSocketEvent;
            if (this.events.containsKey(type)) {
                this.events.getValue(type)(ev);
            }
        };
    }

    CreateEvent(event_id: string, callback: (event: IWebSocketEvent) => void) {
        this.events.setValue(event_id, callback);
    }

    RemoveEvent(event_id: string) {
        this.events.clear(event_id);
    }
}