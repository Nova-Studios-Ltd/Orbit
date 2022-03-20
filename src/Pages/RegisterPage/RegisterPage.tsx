import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import type { Page } from "Types/Components";
import { EncryptStringUsingAES, GenerateRSAKeyPair, GenerateSHA256Hash } from "NSLib/NCEncryption";
import { ContentType, POST } from "NSLib/NCAPI";
import { RegisterPayload, RegPayloadKey } from "DataTypes/RegisterPayload";
import { RegisterStatus } from "DataTypes/Enums";
import { Popup } from "Components/Popup/Popup";

interface RegisterPageProps extends Page {

}

function RegisterPage({ widthConstrained }: RegisterPageProps) {
  const Localizations_Common = useTranslation().t;
  const Localizations_RegisterPage = useTranslation("RegisterPage").t;
  const navigate = useNavigate();

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
    const hashPassword = await GenerateSHA256Hash(password);
    const encPriv = await EncryptStringUsingAES(hashPassword, keypair.PrivateKey);

    const resp = await POST("Register", ContentType.JSON, JSON.stringify(new RegisterPayload(username, hashPassword, email, new RegPayloadKey(encPriv.content as string, encPriv.iv, keypair.PublicKey))));
    if (resp.status === 200) navigate("/login");
    else if (resp.status === 409) setFailStatus(RegisterStatus.EmailUsed);
    else setFailStatus(RegisterStatus.ServerError);
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

  return (
    <div>
      <Typography variant="h6" align="center">{Localizations_RegisterPage("Typography-FormCaption")}</Typography>
      <form className="AuthForm RegisterForm" onSubmit={register}>
        <TextField id="emailField" className="RegisterFormItem" autoFocus required label={Localizations_RegisterPage("TextField_Label-Email")} placeholder={Localizations_RegisterPage("TextField_Placeholder-Email")} value={email} onChange={TextFieldChanged} />
        <TextField id="usernameField" className="RegisterFormItem" required label={Localizations_RegisterPage("TextField_Label-Username")} placeholder={Localizations_RegisterPage("TextField_Placeholder-Username")} value={username} onChange={TextFieldChanged} />
        <TextField id="passwordField" className="RegisterFormItem" type="password" required label={Localizations_RegisterPage("TextField_Label-Password")} placeholder={Localizations_RegisterPage("TextField_Placeholder-Password")} value={password} onChange={TextFieldChanged} helperText={
          <>
            <Typography variant="caption" color="red">{Localizations_RegisterPage("TextField_HelperText-ForgottenPasswordWarning").toUpperCase()}</Typography>
            <br />
            <Typography variant="caption" color="red">{Localizations_RegisterPage("TextField_HelperText-ForgottenPasswordWarningExplanation")} <a target="_blank" href="/E2E">{Localizations_RegisterPage("Learn-More")}</a></Typography>
          </>
        }/>
        <Button className="RegisterFormItem" variant="outlined" type="submit">{Localizations_RegisterPage("Button_Text-Login")}</Button>
      </form>
      <Typography marginTop={1.5}>{Localizations_RegisterPage("Typography-HaveAccountQuestion")} <Link to="/login">{Localizations_RegisterPage("Link-ToLoginForm")}</Link></Typography>
      <Popup triggered={true}>
        We use End-To-End Encryption in order to provide private messaging
      </Popup>
    </div>
  );
}

export default RegisterPage;
