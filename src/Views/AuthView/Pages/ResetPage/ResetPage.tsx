// Globals
import React, { useState } from "react";
import { Button, Card, Link, TextField, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

// Source
import { RequestResetPassword } from "Lib/API/Endpoints/User";
import { GetRSAKeyPair } from "Lib/Encryption/RSA";
import { RSAMemoryKeypair } from "Lib/Encryption/Types/RSAMemoryKeypair";

// Types
import type { Page } from "Types/UI/Components";


interface ResetPageProps extends Page {

}


export default function ResetPage(props: ResetPageProps) {
  const theme = useTheme();
  const location = useLocation();
  const Localizations_ResetPage = useTranslation("ResetPage").t;

  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("")


  const TextFieldChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.currentTarget;
    switch (id) {
      case "passwordField":
        setPassword(value);
        break;
      case "passwordConfField":
        setConfPassword(value);
        break;
      default:
        console.warn(`A TextField is missing an ID or has an ID mismatch with its event handler. (Got ID ${id.length > 0 ? id : "undefined"})`);
        break;
    }
  }

  const resetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = location.search.split("=")[1];
    if (token === undefined || token === "") return;
    RequestResetPassword(password, token, await GetRSAKeyPair() as RSAMemoryKeypair, () => {});
  }

  const E2ELearnMore = (
    <Card className="E2EHelpContainer">
      <Typography variant="body1">{Localizations_ResetPage("TextField_HelperText-ForgottenPasswordWarningExplanationCaption")}</Typography>
      <Typography variant="body2">{Localizations_ResetPage("TextField_HelperText-ForgottenPasswordWarningExplanation")}</Typography>
    </Card>
  );

  return (
    <div className="RegisterPageContainer">
      <Typography variant="h6" align="center">{Localizations_ResetPage("Typography-FormCaption")}</Typography>
      <form className="AuthForm RegisterForm" onSubmit={resetPassword}>
        <TextField id="passwordField" className="RegisterFormItem" type="password" required label={Localizations_ResetPage("TextField_Label-Password")} value={password} onChange={TextFieldChanged} />
        <TextField id="passwordConfField" className="RegisterFormItem" type="password" required label={Localizations_ResetPage("TextField_Label-PasswordConf")} value={confPassword} onChange={TextFieldChanged} helperText={
          <>
            <Typography variant="caption" color="red">{Localizations_ResetPage("TextField_HelperText-ForgottenPasswordWarning")}</Typography>
            <Link underline="none" style={{ cursor: "pointer", marginLeft: 8 }} onClick={(event) => {
              if (props.sharedProps && props.sharedProps.HelpPopup) {
                props.sharedProps.HelpPopup.setAnchor(event.currentTarget);
                props.sharedProps.HelpPopup.setContent(E2ELearnMore);
                props.sharedProps.HelpPopup.setVisibility(true);
              }
            }}>{Localizations_ResetPage("Link-LearnMore")}</Link>
          </>
        }/>
        <Button className="RegisterFormItem" variant="outlined" type="submit">{Localizations_ResetPage("Button_Text-Reset")}</Button>
      </form>
    </div>
  );
}
