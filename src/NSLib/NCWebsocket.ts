import IWebSocketEvent from "../Interfaces/IWebsocketEvent";
import { Dictionary } from "./Dictionary";

export default class NSWebsocket {
    reconnect = 1;
    timesteps = [2500, 4000, 8000, 12000];
    websocket: WebSocket;
    insecure?: boolean;
    address: string;
    token: string;
    terminated: boolean = false;
    events: Dictionary<(event: IWebSocketEvent) => void>;
    timeoutID?: NodeJS.Timeout = undefined;

    constructor(address: string, token: string, insecure?: boolean) {
        this.insecure = insecure;
        this.address = address;
        this.token = token;
        if (insecure !== undefined || !insecure) {
            this.websocket = new WebSocket(`wss://${address}`);
        }
        else {
            this.websocket = new WebSocket(`ws://${address}`);
        }
        this.events = new Dictionary<(event: IWebSocketEvent) => void>();
        this.Init();
    }

    private Init() {
        this.websocket.onmessage = (data) => {
            const event = JSON.parse(data.data);
            const type = event.EventType;
            delete event.EventType;
            const ev = event as IWebSocketEvent;
            if (this.events.containsKey(type)) {
                this.events.getValue(type)(ev);
            }
            else {
                console.warn(`Unknown EventType ${type}`);
            }
        };

        this.websocket.onerror = () => {
            console.error(`Socket Closed Unexpectedly. Attempting Reconnect In ${this.timesteps[this.reconnect - 1] / 1000}s`);
            this.Reconnect();
        };

        this.websocket.onclose = () => {
            console.warn(`Socket Closed. Attempting Reconnect In  ${this.timesteps[this.reconnect - 1] / 1000}s`);
            this.Reconnect();
        };

        this.websocket.onopen = () => {
            if (this.timeoutID !== undefined) clearTimeout(this.timeoutID);
            this.reconnect = 0;
            this.websocket.send(this.token);
        };
    }

    private Reconnect() {
        if (this.terminated) return;
        if (this.reconnect > 4) {
            this.Terminate();
            return;
        }
        this.reconnect++;
        this.timeoutID = setTimeout(() => {
            if (this.insecure !== undefined || !this.insecure) {
                this.websocket = new WebSocket(`wss://${this.address}`);
            }
            else {
                this.websocket = new WebSocket(`ws://${this.address}`);
            }
            this.Init();
        }, this.timesteps[this.reconnect - 1]);
    }

    CreateEvent(event_id: string, callback: (event: IWebSocketEvent) => void) {
        this.events.setValue(event_id, callback);
    }

    RemoveEvent(event_id: string) {
        this.events.clear(event_id);
    }

    Terminate() {
        this.terminated = true;
        this.websocket.close();
    }
}