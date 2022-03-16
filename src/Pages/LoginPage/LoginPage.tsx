import React, { useEffect, useState } from "react";
import { Button, Card, TextField, Typography, useTheme } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";

import PageContainer from "Components/PageContainer/PageContainer";

import type { Page } from "Types/Components";
import { useNavigate } from "react-router-dom";

interface LoginPageProps extends Page {

}

function LoginPage({ widthConstrained }: LoginPageProps) {
  const Localizations_Common = useTranslation().t;
  const Localizations_LoginPage = useTranslation("LoginPage").t;
  const theme = useTheme();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO: Insert login code here
  }

  const TextFieldChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.currentTarget;
    switch (id) {
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

  const LoginPageBrandingContainer = (
    <div className="LoginPageBrandingContainer">
      <img className="BrandingImage" src="logo.png" alt="Orbit Logo"/>
      <Typography className="BrandingTitle" variant="h3">{Localizations_Common("AppTitle")}</Typography>
    </div>
  );

  return (
    <PageContainer>
      <div className="LoginPageCenterContainer" style={{ backgroundColor: widthConstrained ? theme.palette.background.paper : theme.palette.background.default }}>
        {!widthConstrained ? LoginPageBrandingContainer : null}
        <div className="LoginFormContainer" style={{ backgroundColor: theme.palette.background.paper }}>
          {widthConstrained ? LoginPageBrandingContainer : null}
          <form className="LoginForm" onSubmit={login}>
            <TextField id="usernameField" className="LoginFormItem" autoFocus value={username} onChange={TextFieldChanged} />
            <TextField id="passwordField" className="LoginFormItem" type="password" value={password} onChange={TextFieldChanged} />
            <Button className="LoginFormItem" variant="outlined" type="submit">{Localizations_LoginPage("ButtonText_Login")}</Button>
          </form>
        </div>
      </div>
    </PageContainer>
  );
}

export default LoginPage;
