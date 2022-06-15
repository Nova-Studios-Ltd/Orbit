import { Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "DataTypes/Components";
import StatusIndicator, { IndicatorState } from "Components/StatusIndicator/StatusIndicator";
import { NCWebsocketState } from "NSLib/NCWebsocket";
import { useEffect, useRef, useState } from "react";

import { Websocket as Socket } from "Init/AuthHandler";
import { LatencyVisual, SocketStateVisual } from "./NetLib";
import { GETLatency } from "NSLib/APIEvents";

export interface ComponentProps extends NCComponent {
  showAdvanced?: boolean
}

function NetworkDiag(props: ComponentProps) {
  const Localizations_NetworkDiagnostics = useTranslation("NetworkDiagnostics").t;
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

  const websocketAdvanced = () => {
    if (props.showAdvanced) {
      return (<div>
        {(state === NCWebsocketState.Connected || state === NCWebsocketState.Reconnecting)? (<Button disabled>{Localizations_NetworkDiagnostics("Button_Label-ConnectWebsocket")}</Button>) : (<Button onClick={() => Socket.Connect()}>{Localizations_NetworkDiagnostics("Button_Label-ConnectWebsocket")}</Button>)}
        {(state === NCWebsocketState.Disconnected)? (<Button disabled>{Localizations_NetworkDiagnostics("Button_Label-DisconnectWebsocket")}</Button>) : (<Button onClick={() => Socket.Terminate()}>{Localizations_NetworkDiagnostics("Button_Label-DisconnectWebsocket")}</Button>)}
        {(state === NCWebsocketState.Disconnected || state === NCWebsocketState.Connecting || state === NCWebsocketState.Reconnecting)? (<Button disabled>{Localizations_NetworkDiagnostics("Button_Label-ReconnectWebsocket")}</Button>) : (<Button onClick={() => Socket.Reconnect()}>{Localizations_NetworkDiagnostics("Button_Label-ReconnectWebsocket")}</Button>)}
      </div>);
    }
    return (<div></div>);
  }

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.default }}>
      <StatusIndicator state={websocketState[1] as IndicatorState}>
        {Localizations_NetworkDiagnostics("Typography-WebsocketStatusLabel").toString()} {websocketState[0] as string}
        {websocketAdvanced()}
      </StatusIndicator>
      <br/>
      <StatusIndicator state={apiLatency[1] as IndicatorState}>{Localizations_NetworkDiagnostics("Typography-APIStatusLabel").toString()} {apiLatency[0] as string}</StatusIndicator>
    </div>
  )
}

export default NetworkDiag;
