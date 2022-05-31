import React, { useEffect, useState } from "react";
import { Button, TextField, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { LoginNewUser } from "Init/AuthHandler";

import type { Page } from "DataTypes/Components";
import { LoginStatus } from "DataTypes/Enums";
import { AuthViewRoutes, MainViewRoutes } from "DataTypes/Routes";
import { SettingsManager } from "NSLib/SettingsManager";

interface LoginPageProps extends Page {

}

function LoginPage(props: LoginPageProps) {
  const Localizations_Common = useTranslation().t;
  const Localizations_LoginPage = useTranslation("LoginPage").t;
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failureStatus, setFailStatus] = useState(LoginStatus.PendingStatus);

  useEffect(() => {
    if (props.sharedProps && props.sharedProps.changeTitleCallback) props.sharedProps.changeTitleCallback(Localizations_LoginPage("PageTitle"));
  }, [Localizations_LoginPage, props, props.sharedProps?.changeTitleCallback]);

  const login = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    LoginNewUser(email, password).then((status: LoginStatus) => {
      if (status === LoginStatus.Success) navigate(MainViewRoutes.Chat);
      else setFailStatus(status);
    });
  }

  const Manager = new SettingsManager();
  Manager.ContainsCookie("LoggedIn").then(async (value: boolean) => {
    if (location.pathname.toLowerCase().includes(AuthViewRoutes.Login) || location.pathname.toLowerCase().includes(AuthViewRoutes.Register)) {
      Manager.WriteCookie("LoggedIn", "false");
      navigate(MainViewRoutes.Chat);
    }
  });

  const TextFieldChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.currentTarget;
    switch (id) {
      case "emailField":
        setEmail(value);
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
      case LoginStatus.Success:
        return <Typography color="success">{Localizations_LoginPage("FormStatus-Success")}</Typography>;
      case LoginStatus.InvalidCredentials:
        return <Typography color="error">{Localizations_LoginPage("FormStatus-InvalidCredentials")}</Typography>;
      case LoginStatus.UnknownUser:
        return <Typography color="error">{Localizations_LoginPage("FormStatus-UnknownUser")}</Typography>;
      case LoginStatus.ServerError:
        return <Typography color="error">{Localizations_LoginPage("FormStatus-ServerError")}</Typography>;
      case LoginStatus.PendingStatus:
      default:
        return null;
    }
  }

  return (
    <div className="LoginPageContainer">
      <Typography variant="h6" align="center">{Localizations_LoginPage("Typography-FormCaption")}</Typography>
      <FormStatus />
      <form className="AuthForm LoginForm" onSubmit={login}>
        <TextField id="emailField" className="LoginFormItem" autoFocus error={failureStatus === LoginStatus.UnknownUser} required label={Localizations_LoginPage("TextField_Label-Email")} placeholder={Localizations_LoginPage("TextField_Placeholder-Email")} value={email} onChange={TextFieldChanged} />
        <TextField id="passwordField" className="LoginFormItem" type="password" error={failureStatus === LoginStatus.InvalidCredentials} required label={Localizations_LoginPage("TextField_Label-Password")} placeholder={Localizations_LoginPage("TextField_Placeholder-Password")} value={password} onChange={TextFieldChanged} />
        <Button className="LoginFormItem" variant="outlined" type="submit">{Localizations_LoginPage("Button_Text-Login")}</Button>
      </form>
      <Typography marginTop={1.5}>{Localizations_LoginPage("Typography-DontHaveAccountQuestion")} <RouterLink to="/register" style={{ color: theme.palette.primary.main }}>{Localizations_LoginPage("Link-ToRegisterForm")}</RouterLink></Typography>
    </div>
  );
}

export default LoginPage;
