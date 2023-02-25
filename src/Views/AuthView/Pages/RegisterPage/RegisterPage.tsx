import React, { useState } from "react";
import { Button, Card, Link, Popover, TextField, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { RegisterPayload, RegPayloadKey } from "Types/API/RegisterPayload";
import { AESEncrypt } from "Lib/Encryption/AES";
import { GetRSAKeyPair } from "Lib/Encryption/RSA";
import { SHA256 } from "Lib/Encryption/Util";
import Base64Uint8Array from "Lib/Objects/Base64Uint8Array";

import { useDispatch } from "Redux/Hooks";
import { navigate } from "Redux/Thunks/Routing";

import type { Page } from "Types/UI/Components";
import { RegisterStatus } from "Types/Enums";
import { Routes } from "Types/UI/Routing";
import { Coordinates } from "Types/General";
import { NetAPI, NetHeaders, ContentType, NetResponse, HTTPStatus } from "@nova-studios-ltd/typescript-netapi";

interface RegisterPageProps extends Page {

}

function RegisterPage(props: RegisterPageProps) {
  const Localizations_Common = useTranslation().t;
  const Localizations_RegisterPage = useTranslation("RegisterPage").t;
  const theme = useTheme();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [failureStatus, setFailStatus] = useState(RegisterStatus.PendingStatus);
  const [HelpPopupVisible, setHelpVisibility] = useState(false);
  const [HelpPopupAnchorPos, setHelpPopupAnchorPos] = useState({} as unknown as Coordinates);

  const register = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const keypair = await GetRSAKeyPair();
    if (keypair === undefined) {
      setFailStatus(RegisterStatus.RSAFailed);
      return;
    }
    const hashPassword = await SHA256(password);
    const encPriv = await AESEncrypt(hashPassword, new Base64Uint8Array(keypair.PrivateKey));

    NetAPI.POST<never>("Auth/Register", JSON.stringify(new RegisterPayload(username, hashPassword.Base64, email, new RegPayloadKey(encPriv.content.Base64, encPriv.iv.Base64, keypair.PublicKey))), new NetHeaders().WithContentType(ContentType.JSON)).then((response: NetResponse<never>) => {
      if (response.status === HTTPStatus.OK) {
        dispatch(navigate({ pathname: Routes.Login }));
        setFailStatus(RegisterStatus.Success);
      }
      else if (response.status === HTTPStatus.Conflict) {
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
              setHelpPopupAnchorPos({ x: event.clientX, y: event.clientY });
              setHelpVisibility(true);
            }}>{Localizations_RegisterPage("Link-LearnMore")}</Link>
          </>
        }/>
        <Button className="RegisterFormItem" variant="outlined" type="submit">{Localizations_RegisterPage("Button_Text-Register")}</Button>
      </form>
      <Typography marginTop={1.5}>{Localizations_RegisterPage("Typography-HaveAccountQuestion")} <Link sx={{ cursor: "pointer" }} onClick={() => dispatch(navigate({ pathname: Routes.Login }))} style={{ color: theme.palette.primary.main }}>{Localizations_RegisterPage("Link-ToLoginForm")}</Link></Typography>
      <Popover className="GenericPopover" open={HelpPopupVisible} anchorReference="anchorPosition" anchorPosition={{ top: HelpPopupAnchorPos.y, left: HelpPopupAnchorPos.x }} onClose={() => {
          setHelpVisibility(false);
        }}>
        <Card className="E2EHelpContainer">
          <Typography variant="body1">{Localizations_RegisterPage("TextField_HelperText-ForgottenPasswordWarningExplanationCaption")}</Typography>
          <Typography variant="body2">{Localizations_RegisterPage("TextField_HelperText-ForgottenPasswordWarningExplanation")}</Typography>
        </Card>
      </Popover>
    </div>
  );
}

export default RegisterPage;
