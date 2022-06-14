import IWebSocketEvent from "../Interfaces/IWebsocketEvent";
import { Dictionary } from "./Dictionary";

export enum NCWebsocketState {
  Connecting,
  Connected,
  Disconnected,
  Reconnecting
}

export default class NCWebsocket {
  private reconnect = 1;
  private timesteps = [2500, 4000, 8000, 12000];
  websocket: WebSocket;
  private address: string;
  private token: string;
  private terminated: boolean = false;
  private events: Dictionary<(event: IWebSocketEvent) => void>;
  private timeoutID?: NodeJS.Timeout = undefined;


  private _state = NCWebsocketState.Connecting;
  private set state(state: NCWebsocketState) {
    this.OnStateChange(this._state, state);
    this._state = state;
  }
  private get state(): NCWebsocketState {
    return this._state;
  }

  constructor(address: string, token: string) {
    this.address = address;
    this.token = token;
    this.state = NCWebsocketState.Connecting;
    this.websocket = new WebSocket(address);
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
      this.state = NCWebsocketState.Disconnected;
      console.error(`Socket Closed Unexpectedly. Attempting Reconnect In ${this.timesteps[this.reconnect] / 1000}s`);
      this.Reconnect();
    };

    this.websocket.onclose = (e) => {
      this.state = NCWebsocketState.Disconnected;
      console.warn(`Socket Closed. Attempting Reconnect In ${this.timesteps[this.reconnect] / 1000}s`);
      this.Reconnect();
    };

    this.websocket.onopen = () => {
      this.state = NCWebsocketState.Connected;
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
  OnStateChange: (oldState: NCWebsocketState, state: NCWebsocketState) => void = () => {};
  OnLatencyMeasurementEnd: (latency: number) => void = () => {};

  Reconnect() {
    const att = this.reconnect;
    this.OnReconnectStart(this.reconnect);
    if (this.terminated) return;
    this.state = NCWebsocketState.Reconnecting;
    if (this.reconnect > 4) {
      this.state = NCWebsocketState.Disconnected;
      this.Terminate();
      return;
    }
    this.reconnect++;
    this.timeoutID = setTimeout(() => {
      this.websocket.onclose = () => {};
      this.websocket.onopen = () => {};
      this.websocket.onerror = () => {};
      this.websocket.onmessage = () => {};
      this.websocket = new WebSocket(this.address);
      this.Init();
      if (this.timeoutID !== undefined) clearTimeout(this.timeoutID)
      this.OnReconnectEnd(att);
    }, this.timesteps[this.reconnect]);
  }

  CreateEvent(event_id: number, callback: (event: IWebSocketEvent) => void) {
    this.events.setValue(event_id.toString(), callback);
  }

  RemoveEvent(event_id: string) {
    this.events.clear(event_id);
  }

  Connect() {
    this.terminated = false;
    this.state = NCWebsocketState.Connecting;
    this.websocket = new WebSocket(this.address);
    this.Init();
  }

  Terminate() {
    this.OnTerminated();
    this.terminated = true;
    this.state = NCWebsocketState.Disconnected;
    this.websocket.close();
  }

  GetWebsocketState() {
    return this.state;
  }
}
