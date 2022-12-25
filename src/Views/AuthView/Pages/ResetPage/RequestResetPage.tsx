// Global
import React, { useState } from "react";
import { Button, Card, Link, TextField, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

// Source
import { POST, ContentType, HTTPStatusCodes } from "Lib/API/NCAPI";

// Types
import type { Page } from "Types/UI/Components";
import { Routes } from "Types/UI/Routes";


interface RequestResetPageProps extends Page {

}


export default function RequestResetPage(props: RequestResetPageProps) {
  const theme = useTheme();
  const location = useLocation();
  const Localizations_ResetPage = useTranslation("ResetPage").t;

  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState(false);


  const TextFieldChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.currentTarget;
    switch (id) {
      case "emailField":
        setEmail(value);
        break;
      default:
        console.warn(`A TextField is missing an ID or has an ID mismatch with its event handler. (Got ID ${id.length > 0 ? id : "undefined"})`);
        break;
    }
  }

  const resetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(false);

    const resp = await POST(`Auth/RequestReset?email=${email}`, ContentType.EMPTY, "", undefined, false);
    if (resp.status !== HTTPStatusCodes.OK) setError(true);
    else setEmailSent(true);
  }

  const E2ELearnMore = (
    <Card className="E2EHelpContainer">
      <Typography variant="body1">{Localizations_ResetPage("TextField_HelperText-ProvidedEmailCaption")}</Typography>
      <Typography variant="body2">{Localizations_ResetPage("TextField_HelperText-ProvidedEmailWarningExplanation")}</Typography>
    </Card>
  );

  return (
    <div className="ResetPageContainer">
      <Typography variant="h6" align="center">{Localizations_ResetPage("Typography-FormCaption")}</Typography>
      {(!error)? (<></>) : (<Typography variant="caption" color="red">{Localizations_ResetPage("TextField_HelperText-UserNotFound")}</Typography>)}
      {(emailSent)? (<Button className="ReturnHomeButton" variant="outlined" href={Routes.Login}>{Localizations_ResetPage("Button_Text-ReturnHome")}</Button>) : (
      <form className="AuthForm RegisterForm" onSubmit={resetPassword}>
        <TextField id="emailField" className="RegisterFormItem" type="email" required label={Localizations_ResetPage("TextField_Label-Email")} value={email} onChange={TextFieldChanged} helperText={
          <>
            <Typography variant="caption" color="red">{Localizations_ResetPage("TextField_HelperText-ProvidedEmailWarning")}</Typography>
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
      </form>)}
    </div>
  );
}
