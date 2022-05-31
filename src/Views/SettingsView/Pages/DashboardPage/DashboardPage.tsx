import { Avatar, Button, Card, IconButton, Typography, useTheme } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";
import { SETAvatar } from "NSLib/APIEvents";
import { useState } from "react";
import { SettingsManager } from "NSLib/SettingsManager";

import PageContainer from "Components/Containers/PageContainer/PageContainer";
import Section from "Components/Containers/Section/Section";

import type { Page } from "DataTypes/Components";
import { NCFile, UploadFile, WriteToClipboard } from "NSLib/ElectronAPI";

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

  return (
    <PageContainer className={classNames} noPadding>
      <Section className="UserSection">
        <Card className="UserSectionCard">
          <IconButton className="OverlayContainer" onClick={pickProfile}>
            <Avatar sx={{ width: 128, height: 128 }} src={`${settings.User.avatarSrc.replace("64", "128")}&nonce=${props.avatarNonce}`}/>
            <AddIcon fontSize="large" className="Overlay" color="inherit" />
          </IconButton>
          <Button color="inherit" style={{ textTransform: "none" }} onClick={() => WriteToClipboard(usernameText)} onContextMenu={() => WriteToClipboard(settings.User.uuid)}><Typography variant="h5">{usernameText}</Typography></Button>
          <Button disabled>[Edit Username]</Button>
          <Button disabled>[Change Email]</Button>
          <Button disabled>[Change Password]</Button>
          <Button color="error" onClick={() => props.onLogout ? props.onLogout() : null}>[Logout]</Button>
        </Card>
      </Section>
      <Section title="[Nova's Debugging Corner]">
        <iframe title="Yes" src="https://open.spotify.com/embed/track/6k9rAAVAXdBPM0Msv3x45O" />
      </Section>
    </PageContainer>
  );
}

export default DashboardPage;
