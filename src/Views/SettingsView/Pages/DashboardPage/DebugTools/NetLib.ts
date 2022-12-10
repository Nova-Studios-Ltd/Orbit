import { IndicatorState } from "Components/StatusIndicator/StatusIndicator";
import { NCWebsocketState } from "NSLib/NCWebsocket";

export function SocketStateVisual(state: NCWebsocketState) : [string, IndicatorState, NCWebsocketState] {
  switch (state) {
    case NCWebsocketState.Connected:
      return ["Connected", IndicatorState.Positive, state];
    case NCWebsocketState.Connecting:
      return ["Connecting", IndicatorState.Intermediate, state];
    case NCWebsocketState.Disconnected:
      return ["Disconnected", IndicatorState.Negative, state];
    case NCWebsocketState.Reconnecting:
      return ["Reconnecting", IndicatorState.Intermediate, state];
    default:
      return ["Websocket state is unknown", IndicatorState.Negative, state];
  }
}

export function LatencyVisual(latency: number, mappings: number[]) : [string, IndicatorState] {
  if (mappings.length < 3) return ["mapping array to short", IndicatorState.Negative];
  if (latency <= mappings[0]) return [`${latency}ms`, IndicatorState.Positive];
  if (latency <= mappings[1]) return [`${latency}ms`, IndicatorState.Intermediate];
  if (latency <= mappings[2]) return [`${latency}ms`, IndicatorState.Negative];
  return [`${latency}ms`, IndicatorState.Negative];
}
