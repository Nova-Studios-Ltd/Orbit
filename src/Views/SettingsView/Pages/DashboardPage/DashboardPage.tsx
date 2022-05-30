import { Avatar, Button, Card, IconButton, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import PageContainer from "Components/Containers/PageContainer/PageContainer";
import Section from "Components/Containers/Section/Section";

import type { Page } from "DataTypes/Components";
import { SettingsManager } from "NSLib/SettingsManager";
import { NCFile, UploadFile, WriteToClipboard } from "NSLib/ElectronAPI";
import { SETAvatar } from "NSLib/APIEvents";

interface DashboardPageProps extends Page {
  onLogout?: () => void
}

function DashboardPage(props: DashboardPageProps) {
  const Localizations_DashboardPage = useTranslation("DashboardPage").t;
  const classNames = useClassNames("DashboardPageContainer", props.className);

  const settings = new SettingsManager();
  const usernameText = `${settings.ReadCookieSync("Username")}#${settings.ReadCookieSync("Discriminator")}`;

  const pickProfile = async () => {
    UploadFile().then((files: NCFile[]) => {
      if (files.length === 0) return;
      SETAvatar(settings.User.uuid, new Blob([files[0].FileContents]), (set: boolean) => {
        if (set) console.log("Avatar Set");
      });
    });
  }

  return (
    <PageContainer className={classNames} noPadding>
      <Section title="[User]">
        <Card className="Settings_User_Section_Card">
          <IconButton className="OverlayContainer" onClick={pickProfile}>
            <Avatar sx={{ width: 128, height: 128 }} src={settings.User.avatarSrc.replace("64", "128")}/>
            <AddIcon fontSize="large" className="Overlay"/>
          </IconButton>
          <Button className="Username" onClick={() => WriteToClipboard(usernameText)}><Typography variant="h5">{usernameText}</Typography></Button>
          <Button disabled>[Edit Username]</Button>
          <Button disabled>[Change Email]</Button>
          <Button disabled>[Change Password]</Button>
          <Button onClick={() => props.onLogout ? props.onLogout() : null}>[Logout]</Button>
        </Card>
      </Section>
      <Section title="[Advanced]">
        <Button className="Settings_Section_Item" variant="outlined" onClick={() => WriteToClipboard(settings.ReadLocalStorageSync("Token"))}>[Copy Token to Clipboard]</Button>
        <Button id="deleteAccount" className="Settings_Section_Item" variant="outlined" color="error">[Delete Account]</Button>
      </Section>
      <Section title="[Nova's Debugging Corner]">
        <iframe title="Yes" src="https://open.spotify.com/embed/track/6k9rAAVAXdBPM0Msv3x45O"></iframe>
      </Section>
    </PageContainer>
  );
}

export default DashboardPage;
