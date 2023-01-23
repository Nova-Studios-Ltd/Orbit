// Global
import React, { useEffect, useState } from "react";
import { Button, Card, Link, TextField, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";

// Source
import { GetRSAKeyPair } from "Lib/Encryption/RSA";
import { SHA256 } from "Lib/Encryption/Util";
import { AESEncrypt } from "Lib/Encryption/AES";
import Base64Uint8Array from "Lib/Objects/Base64Uint8Array";
import { ContentType, NCAPIResponse, POST } from "Lib/API/NCAPI";

// Types
import { RegisterPayload, RegPayloadKey } from "OldTypes/API/RegisterPayload";
import type { Page } from "OldTypes/UI/Components";
import { RegisterStatus } from "OldTypes/Enums";
import { Routes } from "OldTypes/UI/Routes";


interface RegisterPageProps extends Page {

}

function RegisterPage(props: RegisterPageProps) {
  const Localizations_Common = useTranslation().t;
  const Localizations_RegisterPage = useTranslation("RegisterPage").t;
  const theme = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [failureStatus, setFailStatus] = useState(RegisterStatus.PendingStatus);

  useEffect(() => {
    if (props.sharedProps && props.sharedProps.changeTitleCallback) props.sharedProps.changeTitleCallback(Localizations_RegisterPage("PageTitle"));
  });

  const register = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const keypair = await GetRSAKeyPair();
    if (keypair === undefined) {
      setFailStatus(RegisterStatus.RSAFailed);
      return;
    }
    const hashPassword = await SHA256(password);
    const encPriv = await AESEncrypt(hashPassword, new Base64Uint8Array(keypair.PrivateKey));

    POST("Auth/Register", ContentType.JSON, JSON.stringify(new RegisterPayload(username, hashPassword.Base64, email, new RegPayloadKey(encPriv.content.Base64, encPriv.iv.Base64, keypair.PublicKey))), undefined, false).then((response: NCAPIResponse) => {
      if (response.status === 200) {
        //navigate(Routes.Login);
        setFailStatus(RegisterStatus.Success);
      }
      else if (response.status === 409) {
        setFailStatus(RegisterStatus.EmailUsed);
      }
      else {
        setFailStatus(RegisterStatus.ServerError);
      }
    }).catch((error) => {
      console.error(error);
      setFailStatus(RegisterStatus.ServerError);
    });
  }

  const TextFieldChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.currentTarget;
    switch (id) {
      case "emailField":
        setEmail(value);
        break;
      case "usernameField":
        setUsername(value);
        break;
      case "passwordField":
        setPassword(value);
        break;
      default:
        console.warn(`A TextField is missing an ID or has an ID mismatch with its event handler. (Got ID ${id.length > 0 ? id : "undefined"})`);
        break;
    }
  }

  const FormStatus = () => {
    switch (failureStatus) {
      case RegisterStatus.Success:
        return <Typography color="success">{Localizations_RegisterPage("FormStatus-Success")}</Typography>;
      case RegisterStatus.EmailUsed:
        return <Typography color="error">{Localizations_RegisterPage("FormStatus-EmailError")}</Typography>;
      case RegisterStatus.RSAFailed:
        return <Typography color="error">{Localizations_RegisterPage("FormStatus-RSAKeygenError")}</Typography>;
      case RegisterStatus.ServerError:
        return <Typography color="error">{Localizations_RegisterPage("FormStatus-ServerError")}</Typography>;
      case RegisterStatus.PendingStatus:
      default:
        return null;
    }
  }

  const E2ELearnMore = (
    <Card className="E2EHelpContainer">
      <Typography variant="body1">{Localizations_RegisterPage("TextField_HelperText-ForgottenPasswordWarningExplanationCaption")}</Typography>
      <Typography variant="body2">{Localizations_RegisterPage("TextField_HelperText-ForgottenPasswordWarningExplanation")}</Typography>
    </Card>
  );

  return (
    <div className="RegisterPageContainer">
      {(failureStatus !== RegisterStatus.Success)? (
        <>
          <Typography variant="h6" align="center">{Localizations_RegisterPage("Typography-FormCaption")}</Typography>
          <FormStatus />
            <form className="AuthForm RegisterForm" onSubmit={register}>
              <TextField id="emailField" className="RegisterFormItem" autoFocus required error={failureStatus === RegisterStatus.EmailUsed} label={Localizations_RegisterPage("TextField_Label-Email")} placeholder={Localizations_RegisterPage("TextField_Placeholder-Email")} value={email} onChange={TextFieldChanged} helperText={
                <Typography variant="caption">{Localizations_RegisterPage("TextField_HelperText-EmailHint")}</Typography>
              }/>
              <TextField id="usernameField" className="RegisterFormItem" required label={Localizations_RegisterPage("TextField_Label-Username")} placeholder={Localizations_RegisterPage("TextField_Placeholder-Username")} value={username} onChange={TextFieldChanged} />
              <TextField id="passwordField" className="RegisterFormItem" type="password" required label={Localizations_RegisterPage("TextField_Label-Password")} placeholder={Localizations_RegisterPage("TextField_Placeholder-Password")} value={password} onChange={TextFieldChanged} helperText={
                <>
                  <Typography variant="caption" color="red">{Localizations_RegisterPage("TextField_HelperText-ForgottenPasswordWarning").toUpperCase()}</Typography>
                  <Link underline="none" style={{ cursor: "pointer", marginLeft: 8 }} onClick={(event) => {
                    if (props.sharedProps && props.sharedProps.HelpPopup) {
                      props.sharedProps.HelpPopup.setAnchor(event.currentTarget);
                      props.sharedProps.HelpPopup.setContent(E2ELearnMore);
                      props.sharedProps.HelpPopup.setVisibility(true);
                    }
                  }}>{Localizations_RegisterPage("Link-LearnMore")}</Link>
                </>
              }/>
              <Button className="RegisterFormItem" variant="outlined" type="submit">{Localizations_RegisterPage("Button_Text-Register")}</Button>
            </form>
          <Typography marginTop={1.5}>{Localizations_RegisterPage("Typography-HaveAccountQuestion")} <RouterLink to={Routes.Login} style={{ color: theme.palette.primary.main }}>{Localizations_RegisterPage("Link-ToLoginForm")}</RouterLink></Typography>
        </>
      ) : (
        <>
          <FormStatus />
          <Button className="RegisterFormItem" variant="outlined" fullWidth onClick={() => navigate(Routes.Login)}>{Localizations_RegisterPage("Link-ToLoginForm")}</Button>
        </>
      )}
    </div>
  );
}

export default RegisterPage;
