// Global
import React, { useEffect, useState } from "react";
import { Button, Link, TextField, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { isSubroute } from "Lib/Utility/Utility";

import { useDispatch, useSelector } from "Redux/Hooks";
import { navigate } from "Redux/Thunks/Routing";
import { selectPathname } from "Redux/Selectors/RoutingSelectors";

// Source
import { LoginNewUser } from "Init/AuthHandler";
import { LocalStorage } from "Lib/Storage/LocalStorage";

// Types
import type { Page } from "Types/UI/Components";
import { LoginStatus } from "Types/Enums";
import { Routes } from "Types/UI/Routing";

interface LoginPageProps extends Page {

}

function LoginPage(props: LoginPageProps) {
  const Localizations_Common = useTranslation().t;
  const Localizations_LoginPage = useTranslation("LoginPage").t;
  const dispatch = useDispatch();
  const theme = useTheme();

  const pathname = useSelector(selectPathname());

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failureStatus, setFailStatus] = useState(LoginStatus.PendingStatus);

  const login = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    LoginNewUser(email, password).then((status: LoginStatus) => {
      if (status === LoginStatus.Success)
        dispatch(navigate({ pathname: Routes.Chat }));
      else
        setFailStatus(status);
    }).catch(reason => console.error(reason));
  }

  LocalStorage.ContainsAsync("LoggedIn").then(async (value: boolean) => {
    if ((isSubroute(pathname, Routes.Login) || isSubroute(pathname, Routes.Login) || pathname === Routes.Root) && value) {
      LocalStorage.SetItem("LoggedIn", "false");
      dispatch(navigate({ pathname: Routes.Chat }));
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
      case LoginStatus.UnconfirmedEmail:
        return <Typography color="error">{Localizations_LoginPage("FormStatus-UnconfirmedEmail")}</Typography>;
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
        <TextField id="passwordField" className="LoginFormItem" type="password" error={failureStatus === LoginStatus.InvalidCredentials} required label={Localizations_LoginPage("TextField_Label-Password")} placeholder={Localizations_LoginPage("TextField_Placeholder-Password")} value={password} onChange={TextFieldChanged} helperText={
          <>
            <Typography variant="caption">{Localizations_LoginPage("Typography-ForgotPasswordQuestion")}</Typography>
            <Link underline="none" style={{ cursor: "pointer", marginLeft: 8 }} onClick={() => dispatch(navigate({ pathname: Routes.RequestReset }))}>{Localizations_LoginPage("Link-ToRequestResetForm")}</Link>
          </>
          }/>
        <Button className="LoginFormItem" variant="outlined" type="submit">{Localizations_LoginPage("Button_Text-Login")}</Button>
      </form>
      <Typography marginTop={1.5}>{Localizations_LoginPage("Typography-DontHaveAccountQuestion")} <Link sx={{ cursor: "pointer" }} onClick={() => dispatch(navigate({ pathname: Routes.Register }))} style={{ color: theme.palette.primary.main }}>{Localizations_LoginPage("Link-ToRegisterForm")}</Link></Typography>
    </div>
  );
}

export default LoginPage;
