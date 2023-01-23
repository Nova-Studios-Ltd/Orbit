import IWebSocketEvent from "OldTypes/API/Interfaces/IWebsocketEvent";
import { Dictionary } from "Lib/Objects/Dictionary";

/**
 * Represents the state of NCWebSocket
 */
export enum NCWebsocketState {
  Connecting,
  Connected,
  Disconnected,
  Reconnecting
}

/**
 * Wrapper around the standard JS WebSocket for use with the NCAPI
 */
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

  // WebSocket state events
  OnTerminated: () => void = () => {};
  OnReconnectStart: (attempt: number) => void = () => {};
  OnReconnectEnd: (attempt: number) => void = () => {};
  OnConnected: () => void = () => {};
  OnStateChange: (oldState: NCWebsocketState, state: NCWebsocketState) => void = () => {};
  OnLatencyMeasurementEnd: (latency: number) => void = () => {};

  /**
   * Reconnects the currrent websocket
   */
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

  /**
   * Register a event with the WebSocket
   * @param event_id ID for a event
   * @param callback a function that contains a IWebSocketEvent
   */
  CreateEvent(event_id: number | string, callback: (event: IWebSocketEvent) => void) {
    this.events.setValue(event_id.toString(), callback);
  }

  /**
   * Removes a event from the WebSocket
   * @param event_id ID for a event
   */
  RemoveEvent(event_id: number | string) {
    this.events.clear(event_id.toString());
  }

  /**
   * Connects a disconnected WebSocket
   */
  Connect() {
    this.terminated = false;
    this.state = NCWebsocketState.Connecting;
    this.websocket = new WebSocket(this.address);
    this.Init();
  }

  /**
   * Terminates a WebSocket
   */
  Terminate() {
    this.OnTerminated();
    this.terminated = true;
    this.state = NCWebsocketState.Disconnected;
    this.websocket.close();
  }

  /**
   * Get the state of the WebSocket
   * @returns A NCWebSocketState
   */
  GetWebsocketState() : NCWebsocketState {
    return this.state;
  }
}
