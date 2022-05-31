import { Avatar, Button, Card, IconButton, Typography, useTheme } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { SettingsManager } from "NSLib/SettingsManager";

import PageContainer from "Components/Containers/PageContainer/PageContainer";
import Section from "Components/Containers/Section/Section";

import type { Page } from "DataTypes/Components";
import { NCFile, UploadFile, WriteToClipboard } from "NSLib/ElectronAPI";
import { SETAvatar, UPDATEEmail, UPDATEPassword, UPDATEUsername } from "NSLib/APIEvents";
import { Websocket as Socket } from "Init/AuthHandler";
import { NCWebsocketState } from "NSLib/NCWebsocket";

import StatusIndicator, { IndicatorState } from "./ColoredCircle"

interface DashboardPageProps extends Page {
  avatarNonce?: string,
  onLogout?: () => void,
  onAvatarChanged?: () => void
}

function DashboardPage(props: DashboardPageProps) {
  const Localizations_DashboardPage = useTranslation("DashboardPage").t;
  const classNames = useClassNames("DashboardPageContainer", props.className);
  const theme = useTheme();

  const settings = new SettingsManager();
  const usernameText = `${settings.ReadCookieSync("Username")}#${settings.ReadCookieSync("Discriminator")}`;
  const [websocketState, setWebsocketState] = useState("");

  const updateAvatar = () => {
    if (props.onAvatarChanged) props.onAvatarChanged();
  }

  const pickProfile = async () => {
    UploadFile().then((files: NCFile[]) => {
      if (files.length === 0) return;
      SETAvatar(settings.User.uuid, new Blob([files[0].FileContents]), (set: boolean) => {
        if (set) console.log("Avatar Set");
        updateAvatar();
      });
    });
  }

  const changePasswd = async () => {
    return;
    // TODO Actully allow updating password
    UPDATEPassword("", (status: boolean, newPassword: string) => {

    });
  }

  const changeUsername = async () => {
    return;
    // TODO Actully allow updating username
    UPDATEUsername("", (status: boolean, newUsername: string) => {

    });
  }

  const changeEmail = async () => {
    return;
    // TODO Actully allow updating email
    UPDATEEmail("", (status: boolean, newUsername: string) => {

    });
  }

  if (Socket !== undefined) {
    Socket.OnStateChange = (oldState: NCWebsocketState, state: NCWebsocketState) => {
      setWebsocketState(socketState(state));
    }
  }

  useEffect(() => {
    if (Socket === undefined) return;
    setWebsocketState(socketState(Socket.GetWebsocketState()));
  }, [Socket]);

  const socketState = (state: any) => {
    if (Socket === undefined) return "Websocket not yet initialized";
    switch (state) {
      case NCWebsocketState.Connected:
        return "Connected";
      case NCWebsocketState.Connecting:
        return "Connecting";
      case NCWebsocketState.Disconnected:
        return "Disconnected";
      case NCWebsocketState.Reconnecting:
        return "Reconnecting";
      default:
        return "Websocket state is unknown";
    }
  }

  const socketStateColor = () => {
    if (Socket === undefined) return IndicatorState.Negative;
    switch (Socket.GetWebsocketState()) {
      case NCWebsocketState.Connected:
        return IndicatorState.Positive;
      case NCWebsocketState.Connecting:
        return IndicatorState.Intermedate;
      case NCWebsocketState.Disconnected:
        return IndicatorState.Negative;
      case NCWebsocketState.Reconnecting:
        return IndicatorState.Intermedate
      default:
        return IndicatorState.Negative;
    }
  }

  (window as any).NCWebsocket = Socket;

  return (
    <PageContainer className={classNames} noPadding>
      <Section className="UserSection">
        <Card className="UserSectionCard">
          <div className="UserInfoContainer">
            <IconButton className="OverlayContainer" onClick={pickProfile}>
              <Avatar sx={{ width: 128, height: 128 }} src={`${settings.User.avatarSrc.replace("64", "128")}&nonce=${props.avatarNonce}`}/>
              <AddIcon fontSize="large" className="Overlay" color="inherit" />
            </IconButton>
            <Button color="inherit" style={{ textTransform: "none" }} onClick={() => WriteToClipboard(usernameText)} onContextMenu={() => WriteToClipboard(settings.User.uuid)}><Typography variant="h5">{usernameText}</Typography></Button>
          </div>
          <div className="UserSectionButtonContainer">
            <Button disabled>[Edit Username]</Button>
            <Button disabled>[Change Email]</Button>
            <Button disabled>[Change Password]</Button>
            <Button color="error" onClick={() => props.onLogout ? props.onLogout() : null}>[Logout]</Button>
          </div>
        </Card>
      </Section>
      <Section title="[Nova's Debugging Corner]">
        <iframe title="Yes" src="https://open.spotify.com/embed/track/6k9rAAVAXdBPM0Msv3x45O" />
        <StatusIndicator state={socketStateColor()}></StatusIndicator>
        <Typography>{websocketState}</Typography>
      </Section>
    </PageContainer>
  );
}

export default DashboardPage;
