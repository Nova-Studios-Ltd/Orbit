// Global
import React, { useState } from "react";
import { Avatar, Button, Card, IconButton, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";
import { APP_VERSION, DEBUG } from "vars";
import { Logout } from "Init/AuthHandler";

import { useDispatch } from "Redux/Hooks";
import { openDebugConsole } from "Redux/Slices/ConsoleSlice";
import { navigate } from "Redux/Thunks/Routing";

// Source
import UserData from "Lib/Storage/Objects/UserData";
import { NCFile, UploadFile, WriteToClipboard } from "Lib/ElectronAPI";
import { RequestChangeEmail, RequestChangePassword, RequestChangeUsername, RequestDeleteUser, RequestSetAvatar } from "Lib/API/Endpoints/User";
import { ChannelCache } from "Lib/Storage/Objects/ChannelCache";

// Components
import PageContainer from "Components/Containers/PageContainer/PageContainer";
import Section from "Components/Containers/Section/Section";
import TextCombo from "Components/Input/TextCombo/TextCombo";
import GenericDialog from "Components/Dialogs/GenericDialog/GenericDialog";

// Types
import type { Page } from "Types/UI/Components";
import { Routes } from "Types/UI/Routing";
import { TextComboStates } from "Types/Enums";

interface DashboardPageProps extends Page {
  avatarNonce?: string,
  onLogout?: () => void,
  onAvatarChanged?: () => void
}

function DashboardPage(props: DashboardPageProps) {
  const Localizations_Common = useTranslation().t;
  const Localizations_DashboardPage = useTranslation("DashboardPage").t;
  const Localizations_GenericDialog = useTranslation("GenericDialog").t;
  const classNames = useClassNames("DashboardPageContainer", props.className);
  const dispatch = useDispatch();

  const usernameText = `${UserData.Username}#${UserData.Discriminator}`;
  const avatarSrc = UserData.AvatarSrc ? `${UserData.AvatarSrc}&nonce=${props.avatarNonce}` : "";

  const [NewUsernameValue, setNewUsernameValue] = useState("");
  const [ChangeUsernameDialogVisible, setChangeUsernameDialogVisibility] = useState(false);
  const [NewEmailValue, setNewEmailValue] = useState("");
  const [ChangeEmailDialogVisible, setChangeEmailDialogVisibility] = useState(false);
  const [NewPasswordValue, setNewPasswordValue] = useState("");
  const [ConfirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [ChangePasswordDialogVisible, setChangePasswordDialogVisibility] = useState(false);
  const [DeleteAccountDialogVisible, setDeleteAccountDialogVisibility] = useState(false);
  const [LogoutDialogVisible, setLogoutDialogVisibility] = useState(false);

  const passwordsMatch = (NewPasswordValue === ConfirmPasswordValue);
  const passwordsAndLengthMatch = passwordsMatch && NewPasswordValue.length > 0 && ConfirmPasswordValue.length > 0;

  const updateAvatar = () => {
    if (props.onAvatarChanged) props.onAvatarChanged();
  }

  const pickProfile = async () => {
    UploadFile(false).then((files: NCFile[]) => {
      if (files.length === 0) return;
      RequestSetAvatar(new Blob([files[0].FileContents]), (set: boolean) => {
        if (set) console.log("Avatar Set", UserData.Uuid);
        updateAvatar();
      });
    });
  }

  const changePassword = async () => {
    if (passwordsAndLengthMatch) {
      RequestChangePassword(NewPasswordValue, (status: boolean, newPassword: string) => {
      console.log(`Change Password Status: ${status}`);
    });
      setChangePasswordDialogVisibility(false);
    }
  }

  const changeUsername = async () => {
    if (NewUsernameValue.length > 0) {
        RequestChangeUsername(NewUsernameValue, (status: boolean, newUsername: string) => {
        console.log(`Change Username Status: ${status}; New Username: ${newUsername}`);
      });
      setChangeUsernameDialogVisibility(false);
    }
  }

  const changeEmail = async () => {
    if (NewEmailValue.length > 0) {
      RequestChangeEmail(NewEmailValue, (status: boolean, newEmail: string) => {
        console.log(`Change Email Status: ${status}; New Email: ${newEmail}`);
      });
      setChangeEmailDialogVisibility(false);
    }
  }

  const deleteAccount = () => {
    RequestDeleteUser((status) => {
      if (status) {
        dispatch(navigate({ pathname: Routes.Login }));
        console.success("Account Deletion Successful")
      }
      else {
        console.error("Account Deletion Failed")
      }
    });
    setDeleteAccountDialogVisibility(false);
  }

  const logout = async () => {
    await Logout();
    dispatch(navigate({ pathname: Routes.Login }));
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
    setConfirmPasswordValue("");
    setChangePasswordDialogVisibility(true);
  }

  const clearCaches = () => {
    ChannelCache.DeleteCaches();
    caches.delete("NCMediaCache");
    console.success("Caches cleared");
  }

  return (
    <PageContainer className={classNames}>
      <Section className="UserSection">
        <Card className="UserSectionCard">
          <div className="UserInfoContainer">
            <IconButton className="OverlayContainer" onClick={pickProfile}>
              <Avatar sx={{ width: 128, height: 128 }} src={avatarSrc}/>
              <AddIcon fontSize="large" className="Overlay" color="inherit" />
            </IconButton>
            <div className="UserInfoButtonContainer">
              <Button color="inherit" style={{ textTransform: "none" }} onClick={() => WriteToClipboard(usernameText)} onContextMenu={() => WriteToClipboard(UserData.Uuid)}><Typography variant="h5">{usernameText}</Typography></Button>
            </div>
          </div>
          <div className="UserSectionButtonContainer">
            <Button className="SectionButton" id="EditUsernameButton" onClick={onChangeUsername}>{Localizations_DashboardPage("Button_Label-EditUsername")}</Button>
            <Button className="SectionButton" id="EditEmailButton" onClick={onChangeEmail}>{Localizations_DashboardPage("Button_Label-EditEmail")}</Button>
            <Button className="SectionButton" id="EditPasswordButton" onClick={onChangePassword}>{Localizations_DashboardPage("Button_Label-EditPassword")}</Button>
            <Button className="SectionButton" id="LogoutButton" color="error" onClick={() => setLogoutDialogVisibility(true)}>{Localizations_DashboardPage("Button_Label-Logout")}</Button>
          </div>
        </Card>
      </Section>
      <Section title={Localizations_DashboardPage("Section_Title-Advanced")}>
        <div className="SectionButtonContainer">
          <Button className="SectionButton" id="CopyTokenButton" variant="outlined" color="warning" onClick={() => WriteToClipboard(UserData.Token)}>{Localizations_DashboardPage("Button_Label-CopyToken")}</Button>
          <Button className="SectionButton" id="ClearCacheButton" variant="outlined" color="warning" onClick={clearCaches}>{Localizations_DashboardPage("Button_Label-ClearCache")}</Button>
          <Button className="SectionButton" id="DeleteAccountButton" variant="outlined" color="error" onClick={() => setDeleteAccountDialogVisibility(true)}>{Localizations_DashboardPage("Button_Label-DeleteAccount")}</Button>
          <Button className="SectionButton" id="OpenConsoleButton" variant="outlined" color="primary" disabled={!DEBUG} onClick={() => dispatch(openDebugConsole())}>{Localizations_DashboardPage("Button_Label-OpenConsole")}</Button>
        </div>
        <Typography variant="caption" color="error" textTransform="uppercase">{Localizations_DashboardPage("Typography-TokenWarning")}</Typography>
        <span>
          <Typography variant="caption" fontWeight="bold">{Localizations_Common("AppTitle")}</Typography> <Typography variant="caption">{Localizations_DashboardPage("Typography-AppVersion", { version: APP_VERSION })}</Typography>
        </span>
      </Section>
      <GenericDialog onClose={() => setChangeUsernameDialogVisibility(false)} open={ChangeUsernameDialogVisible} title={Localizations_DashboardPage("Typography-ChangeUsernameDialogTitle")} buttons={
        <>
          <Button onClick={() => setChangeUsernameDialogVisibility(false)}>{Localizations_GenericDialog("Button_Label-DialogCancel")}</Button>
          <Button disabled={!(NewUsernameValue.length > 0)} onClick={() => changeUsername()}>{Localizations_GenericDialog("Button_Label-DialogOK")}</Button>
        </>
      }>
        <TextCombo fullWidth submitButton={false} placeholder={Localizations_DashboardPage("TextField_Placeholder-ChangeUsernamePrompt")} value={NewUsernameValue} onChange={(event) => event.value !== undefined ? setNewUsernameValue(event.value) : null} onSubmit={() => changeUsername()} />
      </GenericDialog>
      <GenericDialog onClose={() => setChangeEmailDialogVisibility(false)} open={ChangeEmailDialogVisible} title={Localizations_DashboardPage("Typography-ChangeEmailDialogTitle")} buttons={
        <>
          <Button onClick={() => setChangeEmailDialogVisibility(false)}>{Localizations_GenericDialog("Button_Label-DialogCancel")}</Button>
          <Button disabled={!(NewEmailValue.length > 0)} onClick={() => changeEmail()}>{Localizations_GenericDialog("Button_Label-DialogOK")}</Button>
        </>
      }>
        <TextCombo fullWidth submitButton={false} placeholder={Localizations_DashboardPage("TextField_Placeholder-ChangeEmailPrompt")} value={NewEmailValue} onChange={(event) => event.value !== undefined ? setNewEmailValue(event.value) : null} onSubmit={() => changeEmail()} />
      </GenericDialog>
      <GenericDialog onClose={() => setChangePasswordDialogVisibility(false)} open={ChangePasswordDialogVisible} title={Localizations_DashboardPage("Typography-ChangePasswordDialogTitle")} buttons={
        <>
          <Button onClick={() => setChangePasswordDialogVisibility(false)}>{Localizations_GenericDialog("Button_Label-DialogCancel")}</Button>
          <Button disabled={!passwordsAndLengthMatch} onClick={() => changePassword()}>{Localizations_GenericDialog("Button_Label-DialogOK")}</Button>
        </>
      }>
        <TextCombo fullWidth isPassword submitButton={false} placeholder={Localizations_DashboardPage("TextField_Placeholder-ChangePasswordPrompt")} value={NewPasswordValue} onChange={(event) => event.value !== undefined ? setNewPasswordValue(event.value) : null} onSubmit={() => changePassword()} />
        <TextCombo fullWidth isPassword submitButton={false} placeholder={Localizations_DashboardPage("TextField_Placeholder-ConfirmPasswordPrompt")} status={(!passwordsMatch) ? TextComboStates.Error : TextComboStates.Neutral} statusText={Localizations_DashboardPage("TextField_StatusText-NonmatchingPassword")} value={ConfirmPasswordValue} onChange={(event) => event.value !== undefined ? setConfirmPasswordValue(event.value) : null} onSubmit={() => changePassword()} />
      </GenericDialog>
      <GenericDialog onClose={() => setDeleteAccountDialogVisibility(false)} open={DeleteAccountDialogVisible} title={Localizations_DashboardPage("Typography-DeleteAccountDialogTitle")} buttons={
        <>
          <Button onClick={() => setDeleteAccountDialogVisibility(false)}>{Localizations_GenericDialog("Button_Label-DialogCancel")}</Button>
          <Button color="error" onClick={() => deleteAccount()}>{Localizations_GenericDialog("Button_Label-DialogDelete")}</Button>
        </>
      }>
        <div className="GenericDialogTextContainer">
          <Typography variant="body1">{Localizations_DashboardPage("Typography-DeleteAccountBlurb", { AppTitle: Localizations_Common("AppTitle") })}</Typography>
          <Typography variant="caption">{Localizations_DashboardPage("Typography-DeleteAccountThanks", { AppTitle: Localizations_Common("AppTitle") })}</Typography>
        </div>
      </GenericDialog>
      <GenericDialog onClose={() => setLogoutDialogVisibility(false)} open={LogoutDialogVisible} title={Localizations_DashboardPage("Typography-LogoutDialogTitle")} buttons={
        <>
          <Button onClick={() => setLogoutDialogVisibility(false)}>{Localizations_GenericDialog("Button_Label-DialogCancel")}</Button>
          <Button color="error" onClick={() => logout()}>{Localizations_GenericDialog("Button_Label-DialogOK")}</Button>
        </>
      }>
        <Typography variant="body1">{Localizations_DashboardPage("Typography-LogoutBlurb")}</Typography>
      </GenericDialog>
    </PageContainer>
  );
}

export default DashboardPage;
