import { Avatar, Button, Card, IconButton, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import PageContainer from "Components/Containers/PageContainer/PageContainer";
import Section from "Components/Containers/Section/Section";

import type { Page } from "DataTypes/Components";
import { SettingsManager } from "NSLib/SettingsManager";
import { NCFile, UploadFile } from "NSLib/ElectronAPI";
import { SETAvatar } from "NSLib/APIEvents";

interface DashboardPageProps extends Page {

}

function DashboardPage(props: DashboardPageProps) {
  const Localizations_Page = useTranslation("DashboardPage").t;
  const classNames = useClassNames("DashboardPageContainer", props.className);

  const settings = new SettingsManager();
  const usernameText = `${settings.ReadCookieSync("Username")}#${settings.ReadCookieSync("Discriminator")}`;

  const pickProfile = async () => {
    UploadFile().then((files: NCFile[]) => {
      if (files.length === 0) return;
      SETAvatar(settings.User.uuid, new Blob([files[0].FileContents]), (set: boolean) => {});
    });
  }

  return (
    <PageContainer className={classNames} noPadding>
      <div className="Settings_Page_InnerContainer">
        <Section title="User">
          <Card className="Settings_User_Section_Card">
            <IconButton className="OverlayContainer" onClick={pickProfile}>
              <Avatar sx={{ width: 128, height: 128 }} src={settings.User.avatarSrc.replace("64", "128")}/>
              <AddIcon fontSize="large" className="Overlay"/>
            </IconButton>
            <Typography variant="h5">{usernameText}</Typography>
            <Button disabled>Edit Username</Button>
            <Button disabled>Change Password</Button>
            <Button disabled>Logout</Button>
          </Card>
        </Section>
        <Section title="Advanced">
          <Button className="Settings_Section_Item" variant="outlined">Copy Token to Clipboard</Button>
          <Button id="deleteAccount" className="Settings_Section_Item" variant="outlined" color="error">Delete Account</Button>
        </Section>
      </div>
    </PageContainer>
  );
}

export default DashboardPage;
