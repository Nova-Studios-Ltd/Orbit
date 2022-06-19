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
import React, { ReactNode, useState } from "react";
import CacheTools from "./DebugTools/CacheTools/CacheTools";
import TextCombo from "Components/Input/TextCombo/TextCombo";
import GenericDialog from "Components/Dialogs/GenericDialog/GenericDialog";


interface DashboardPageProps extends Page {
  avatarNonce?: string,
  onLogout?: () => void,
  onAvatarChanged?: () => void
}

function DashboardPage(props: DashboardPageProps) {
  const Localizations_DashboardPage = useTranslation("DashboardPage").t;
  const Localizations_GenericDialog = useTranslation("GenericDialog").t;
  const classNames = useClassNames("DashboardPageContainer", props.className);
  const theme = useTheme();

  const settings = new SettingsManager();
  const usernameText = `${settings.ReadCookieSync("Username")}#${settings.ReadCookieSync("Discriminator")}`;
  const avatarSrc = settings && settings.User && settings.User.avatarSrc ? `${settings.User.avatarSrc}&nonce=${props.avatarNonce}` : "";

  const [NewUsernameValue, setNewUsernameValue] = useState("");
  const [ChangeUsernameDialogVisible, setChangeUsernameDialogVisibility] = useState(false);
  const [NewEmailValue, setNewEmailValue] = useState("");
  const [ChangeEmailDialogVisible, setChangeEmailDialogVisibility] = useState(false);
  const [NewPasswordValue, setNewPasswordValue] = useState("");
  const [ChangePasswordDialogVisible, setChangePasswordDialogVisibility] = useState(false);

  const updateAvatar = () => {
    if (props.onAvatarChanged) props.onAvatarChanged();
  }

  const pickProfile = async () => {
    UploadFile(false).then((files: NCFile[]) => {
      if (files.length === 0) return;
      SETAvatar(settings.User.uuid, new Blob([files[0].FileContents]), (set: boolean) => {
        if (set) console.log("Avatar Set", settings.User.uuid);
        updateAvatar();
      });
    });
  }

  const changePassword = async () => {
    UPDATEPassword(NewPasswordValue, (status: boolean, newPassword: string) => {
      console.log(`Change Username Status: ${status}; New Password: ${newPassword}`);
    });
    setChangePasswordDialogVisibility(false);
  }

  const changeUsername = async () => {
    UPDATEUsername(NewUsernameValue, (status: boolean, newUsername: string) => {
      console.log(`Change Username Status: ${status}; New Username: ${newUsername}`);
    });
    setChangeUsernameDialogVisibility(false);
  }

  const changeEmail = async () => {
    UPDATEEmail(NewEmailValue, (status: boolean, newEmail: string) => {
      console.log(`Change Email Status: ${status}; New Email: ${newEmail}`);
    });
    setChangeEmailDialogVisibility(false);
  }

  const deleteAccount = () => {
    console.log("sike");
  }

  const onChangeUsername = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNewUsernameValue("");
    setChangeUsernameDialogVisibility(true);
  }

  const onChangeEmail = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNewEmailValue("");
    setChangeEmailDialogVisibility(true);
  }

  const onChangePassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNewPasswordValue("");
    setChangePasswordDialogVisibility(true);
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
            <Button className="SectionButton" id="EditUsernameButton" onClick={onChangeUsername}>{Localizations_DashboardPage("Button_Label-EditUsername")}</Button>
            <Button className="SectionButton" id="EditEmailButton" onClick={onChangeEmail}>{Localizations_DashboardPage("Button_Label-EditEmail")}</Button>
            <Button className="SectionButton" id="EditPasswordButton" onClick={onChangePassword}>{Localizations_DashboardPage("Button_Label-EditPassword")}</Button>
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
      <GenericDialog open={ChangeUsernameDialogVisible} title={Localizations_DashboardPage("Typography-ChangeUsernameDialogTitle")} buttons={
        <>
          <Button onClick={() => setChangeUsernameDialogVisibility(false)}>{Localizations_GenericDialog("Button_Label-DialogCancel")}</Button>
          <Button onClick={() => changeUsername()}>{Localizations_GenericDialog("Button_Label-DialogOK")}</Button>
        </>
      }>
        <TextCombo fullWidth={props.sharedProps?.widthConstrained} submitButton={false} textFieldPlaceholder={Localizations_DashboardPage("TextField_Placeholder-ChangeUsernamePrompt")} value={NewUsernameValue} onChange={(event) => event.value ? setNewUsernameValue(event.value) : null} onSubmit={() => changeUsername()} />
      </GenericDialog>
      <GenericDialog open={ChangeEmailDialogVisible} title={Localizations_DashboardPage("Typography-ChangeEmailDialogTitle")} buttons={
        <>
          <Button onClick={() => setChangeEmailDialogVisibility(false)}>{Localizations_GenericDialog("Button_Label-DialogCancel")}</Button>
          <Button onClick={() => changeEmail()}>{Localizations_GenericDialog("Button_Label-DialogOK")}</Button>
        </>
      }>
        <TextCombo fullWidth={props.sharedProps?.widthConstrained} submitButton={false} textFieldPlaceholder={Localizations_DashboardPage("TextField_Placeholder-ChangeEmailPrompt")} value={NewEmailValue} onChange={(event) => event.value ? setNewEmailValue(event.value) : null} onSubmit={() => changePassword()} />
      </GenericDialog>
      <GenericDialog open={ChangePasswordDialogVisible} title={Localizations_DashboardPage("Typography-ChangePasswordDialogTitle")} buttons={
        <>
          <Button onClick={() => setChangePasswordDialogVisibility(false)}>{Localizations_GenericDialog("Button_Label-DialogCancel")}</Button>
          <Button onClick={() => changePassword()}>{Localizations_GenericDialog("Button_Label-DialogOK")}</Button>
        </>
      }>
        <TextCombo fullWidth={props.sharedProps?.widthConstrained} isPassword submitButton={false} textFieldPlaceholder={Localizations_DashboardPage("TextField_Placeholder-ChangePasswordPrompt")} value={NewPasswordValue} onChange={(event) => event.value ? setNewPasswordValue(event.value) : null} onSubmit={() => changeEmail()} />
      </GenericDialog>
    </PageContainer>
  );
}

export default DashboardPage;
