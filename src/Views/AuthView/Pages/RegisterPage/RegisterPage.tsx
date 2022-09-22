import React, { createContext, useEffect, useState } from "react";
import { Button, Card, Link, TextField, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { ContentType, NCAPIResponse, POST } from "NSLib/NCAPI";
import { RegisterPayload, RegPayloadKey } from "Types/API/RegisterPayload";

import type { Page, SharedProps } from "Types/UI/Components";
import { RegisterStatus } from "Types/Enums";
import { EncryptBase64, GenerateBase64SHA256, GenerateRSAKeyPair } from "NSLib/NCEncryption";
import { Base64String } from "NSLib/Base64";
import { Routes } from "Types/UI/Routes";

interface RegisterPageProps extends Page {

}

function RegisterPage(props: RegisterPageProps) {
  const Localizations_Common = useTranslation().t;
  const Localizations_RegisterPage = useTranslation("RegisterPage").t;
  const theme = useTheme();
  const navigate = useNavigate();

  const SharedPropsContext = createContext({} as SharedProps);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [failureStatus, setFailStatus] = useState(RegisterStatus.PendingStatus);

  const register = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const keypair = await GenerateRSAKeyPair();
    if (keypair === undefined) {
      setFailStatus(RegisterStatus.RSAFailed);
      return;
    }
    const hashPassword = await GenerateBase64SHA256(password);
    const encPriv = await EncryptBase64(hashPassword, Base64String.CreateBase64String(keypair.PrivateKey));

    POST("Auth/Register", ContentType.JSON, JSON.stringify(new RegisterPayload(username, hashPassword.Base64, email, new RegPayloadKey(encPriv.content as string, encPriv.iv, keypair.PublicKey))), undefined, false).then((response: NCAPIResponse) => {
      if (response.status === 200) {
        navigate(Routes.Login);
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
    <SharedPropsContext.Consumer>
      {
        sharedProps => {
          if (sharedProps && sharedProps.changeTitleCallback) sharedProps.changeTitleCallback(Localizations_RegisterPage("PageTitle"));

          return (
            <div className="RegisterPageContainer">
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
                      if (sharedProps && sharedProps.HelpPopup) {
                        sharedProps.HelpPopup.setAnchor(event.currentTarget);
                        sharedProps.HelpPopup.setContent(E2ELearnMore);
                        sharedProps.HelpPopup.setVisibility(true);
                      }
                    }}>{Localizations_RegisterPage("Link-LearnMore")}</Link>
                  </>
                }/>
                <Button className="RegisterFormItem" variant="outlined" type="submit">{Localizations_RegisterPage("Button_Text-Register")}</Button>
              </form>
              <Typography marginTop={1.5}>{Localizations_RegisterPage("Typography-HaveAccountQuestion")} <RouterLink to={Routes.Login} style={{ color: theme.palette.primary.main }}>{Localizations_RegisterPage("Link-ToLoginForm")}</RouterLink></Typography>
            </div>
          );
        }
      }
    </SharedPropsContext.Consumer>
  );
}

export default RegisterPage;
