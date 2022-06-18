import { Avatar, Button, Card, FormControlLabel, IconButton, Switch, Typography, useTheme } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";
import { SettingsManager } from "NSLib/SettingsManager";

import PageContainer from "Components/Containers/PageContainer/PageContainer";
import Section from "Components/Containers/Section/Section";

import type { Page } from "DataTypes/Components";
import { NCFile, UploadFile, WriteToClipboard } from "NSLib/ElectronAPI";
import { SETAvatar, UPDATEEmail, UPDATEPassword, UPDATEUsername } from "NSLib/APIEvents";
import NetworkDiag from "./DebugTools/NetworkDiagnostics";
import { useState } from "react";
import CacheTools from "./DebugTools/CacheTools/CacheTools";


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
  const avatarSrc = settings && settings.User && settings.User.avatarSrc ? `${settings.User.avatarSrc.replace("64", "128")}&nonce=${props.avatarNonce}` : "";

  const updateAvatar = () => {
    if (props.onAvatarChanged) props.onAvatarChanged();
  }

  const pickProfile = async () => {
    UploadFile(false).then((files: NCFile[]) => {
      if (files.length === 0) return;
      SETAvatar(settings.User.uuid, new Blob([files[0].FileContents]), (set: boolean) => {
        if (set) console.log("Avatar Set");
        updateAvatar();
      });
    });
  }

  const changePasswd = async () => {
    return;
    // TODO Actually allow updating password
    UPDATEPassword("", (status: boolean, newPassword: string) => {

    });
  }

  const changeUsername = async () => {
    return;
    // TODO Actually allow updating username
    UPDATEUsername("", (status: boolean, newUsername: string) => {

    });
  }

  const changeEmail = async () => {
    return;
    // TODO Actually allow updating email
    UPDATEEmail("", (status: boolean, newUsername: string) => {

    });
  }

  const deleteAccount = () => {
    console.log("sike");
  }

  return (
    <PageContainer className={classNames} noPadding>
      <Section className="UserSection">
        <Card className="UserSectionCard">
          <div className="UserInfoContainer">
            <IconButton className="OverlayContainer" onClick={pickProfile}>
              <Avatar sx={{ width: 128, height: 128 }} src={avatarSrc}/>
              <AddIcon fontSize="large" className="Overlay" color="inherit" />
            </IconButton>
            <Button color="inherit" style={{ textTransform: "none" }} onClick={() => WriteToClipboard(usernameText)} onContextMenu={() => WriteToClipboard(settings.User.uuid)}><Typography variant="h5">{usernameText}</Typography></Button>
          </div>
          <div className="UserSectionButtonContainer">
            <Button className="SectionButton" id="EditUsernameButton">{Localizations_DashboardPage("Button_Label-EditUsername")}</Button>
            <Button className="SectionButton" id="EditEmailButton" disabled>{Localizations_DashboardPage("Button_Label-EditEmail")}</Button>
            <Button className="SectionButton" id="EditPasswordButton" disabled>{Localizations_DashboardPage("Button_Label-EditPassword")}</Button>
            <Button className="SectionButton" id="LogoutButton" color="error" onClick={() => props.onLogout ? props.onLogout() : null}>{Localizations_DashboardPage("Button_Label-Logout")}</Button>
          </div>
        </Card>
      </Section>
      <Section title={Localizations_DashboardPage("Section_Title-Diagnostics")}>
        <NetworkDiag showAdvanced={true}/>
      </Section>
      <Section title={Localizations_DashboardPage("Section_Title-Advanced")}>
        <div className="SectionButtonContainer">
          <Button className="SectionButton" id="CopyTokenButton" variant="outlined" color="warning" onClick={() => WriteToClipboard(settings.User.token)}>{Localizations_DashboardPage("Button_Label-CopyToken")}</Button>
          <Button className="SectionButton" id="DeleteAccountButton" variant="outlined" color="error" onClick={() => deleteAccount()}>{Localizations_DashboardPage("Button_Label-DeleteAccount")}</Button>
        </div>
        <Typography variant="caption" color="error" textTransform="uppercase">{Localizations_DashboardPage("Typography-TokenWarning")}</Typography>
      </Section>
    </PageContainer>
  );
}

export default DashboardPage;
