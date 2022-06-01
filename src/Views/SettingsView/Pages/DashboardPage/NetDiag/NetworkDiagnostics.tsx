import { Button, useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "DataTypes/Components";
import StatusIndicator, { IndicatorState } from "Components/StatusIndicator/StatusIndicator";
import { NCWebsocketState } from "NSLib/NCWebsocket";
import { useEffect, useRef, useState } from "react";

import { Websocket as Socket } from "Init/AuthHandler";
import { LatencyVisual, SocketStateVisual } from "./NetLib";
import { GETLatency } from "NSLib/APIEvents";

export interface ComponentProps extends NCComponent {

}

function NetworkDiag(props: ComponentProps) {
  const theme = useTheme();
  const classNames = useClassNames("ComponentContainer", props.className);
  const [websocketState, setWebsocketState] = useState(["", IndicatorState.Negative, NCWebsocketState.Disconnected]);
  const [apiLatency, setApiLatency] = useState(["0ms", IndicatorState.Negative]);
  const timeout = useRef(undefined as any);


  if (Socket !== undefined) {
    Socket.OnStateChange = (oldState: NCWebsocketState, state: NCWebsocketState) => {
      setWebsocketState(SocketStateVisual(state));
    };
  }

  const testLatency = async () => {
    setApiLatency(LatencyVisual(await GETLatency(), [80, 120, 180]));
  }

  useEffect(() => {
    if (Socket === undefined) return;
    setWebsocketState(SocketStateVisual(Socket.GetWebsocketState()));

    testLatency();
    timeout.current = setInterval(testLatency, 2000);

    return () => {clearInterval(timeout.current)};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Socket]);

  (window as any).NCWebsocket = Socket;

  const state = websocketState[2] as NCWebsocketState;
  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.default }}>
      <StatusIndicator state={websocketState[1] as IndicatorState}>
        Websocket {websocketState[0] as string}
        <div>
          {(state === NCWebsocketState.Connected)? (<Button disabled>Connected</Button>) : (<Button onClick={() => Socket.Connect()}>Connect</Button>)}
          {(state === NCWebsocketState.Disconnected)? (<Button disabled>Disconnected</Button>) : (<Button onClick={() => Socket.Terminate()}>Disconnect</Button>)}
          {(state === NCWebsocketState.Disconnected || state === NCWebsocketState.Connecting || state === NCWebsocketState.Reconnecting)? (<Button disabled>Reconnect</Button>) : (<Button onClick={() => Socket.Reconnect()}>Reconnect</Button>)}
        </div>
      </StatusIndicator>
      <br/>
      <StatusIndicator state={apiLatency[1] as IndicatorState}>API Latency {apiLatency[0] as string}</StatusIndicator>
    </div>
  )
}

export default NetworkDiag;
