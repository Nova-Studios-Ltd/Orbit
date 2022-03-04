import IWebSocketEvent from "../Interfaces/IWebsocketEvent";
import { Dictionary } from "./Dictionary";

export default class NCWebsocket {
    private reconnect = 1;
    private timesteps = [2500, 4000, 8000, 12000];
    websocket: WebSocket;
    private insecure?: boolean;
    private address: string;
    private token: string;
    private terminated: boolean = false;
    private events: Dictionary<(event: IWebSocketEvent) => void>;
    private timeoutID?: NodeJS.Timeout = undefined;

    constructor(address: string, token: string, insecure?: boolean) {
        this.insecure = insecure;
        this.address = address;
        this.token = token;
        if (insecure === undefined || insecure === false) {
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

        this.websocket.onerror = (e) => {
            console.error(`Socket Closed Unexpectedly. Attempting Reconnect In ${this.timesteps[this.reconnect - 1] / 1000}s`);
            this.Reconnect();
        };

        this.websocket.onclose = () => {
            console.warn(`Socket Closed. Attempting Reconnect In ${this.timesteps[this.reconnect - 1] / 1000}s`);
            this.Reconnect();
        };

        this.websocket.onopen = () => {
            this.OnConnected();
            if (this.timeoutID !== undefined) clearTimeout(this.timeoutID);
            this.reconnect = 0;
            this.websocket.send(this.token);
        };
    }

    OnTerminated: () => void = () => {};
    OnReconnectStart: (attempt: number) => void = () => {};
    OnReconnectEnd: (attempt: number) => void = () => {};
    OnConnected: () => void = () => {};

    private Reconnect() {
        const att = this.reconnect;
        this.OnReconnectStart(this.reconnect);
        if (this.terminated) return;
        if (this.reconnect > 4) {
            this.Terminate();
            return;
        }
        this.reconnect++;
        this.timeoutID = setTimeout(() => {
            if (this.insecure === undefined || this.insecure === false) {
                this.websocket = new WebSocket(`wss://${this.address}`);
            }
            else {
                this.websocket = new WebSocket(`ws://${this.address}`);
            }
            this.Init();
            if (this.timeoutID !== undefined) clearTimeout(this.timeoutID)
            this.OnReconnectEnd(att);
        }, this.timesteps[this.reconnect - 1]);
    }

    CreateEvent(event_id: string, callback: (event: IWebSocketEvent) => void) {
        this.events.setValue(event_id, callback);
    }

    RemoveEvent(event_id: string) {
        this.events.clear(event_id);
    }

    Terminate() {
        this.OnTerminated();
        this.terminated = true;
        this.websocket.close();
    }
}