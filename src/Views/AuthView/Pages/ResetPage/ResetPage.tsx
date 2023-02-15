// Globals
import { Button, Card, Link, Popover, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

// Types
import { Coordinates } from "Types/General";
import type { Page } from "Types/UI/Components";

interface ResetPageProps extends Page {

}

export default function ResetPage() {
  const Localizations_ResetPage = useTranslation("ResetPage").t;

  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [HelpPopupVisible, setHelpVisibility] = useState(false);
  const [HelpPopupAnchorPos, setHelpPopupAnchorPos] = useState({} as unknown as Coordinates);

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

    /*const token = location.search.split("=")[1];
    if (token === undefined || token === "") return;
    RESETPassword(password, token, await GenerateRSAKeyPair() as RSAMemoryKeyPair, () => {});*/
  }

  return (
    <div className="RegisterPageContainer">
      <Typography variant="h6" align="center">{Localizations_ResetPage("Typography-FormCaption")}</Typography>
      <form className="AuthForm RegisterForm" onSubmit={resetPassword}>
        <TextField id="passwordField" className="RegisterFormItem" type="password" required label={Localizations_ResetPage("TextField_Label-Password")} value={password} onChange={TextFieldChanged} />
        <TextField id="passwordConfField" className="RegisterFormItem" type="password" required label={Localizations_ResetPage("TextField_Label-PasswordConf")} value={confPassword} onChange={TextFieldChanged} helperText={
          <>
            <Typography variant="caption" color="red">{Localizations_ResetPage("TextField_HelperText-ForgottenPasswordWarning")}</Typography>
            <Link underline="none" style={{ cursor: "pointer", marginLeft: 8 }} onClick={(event) => {
              setHelpPopupAnchorPos({ x: event.clientX, y: event.clientY });
              setHelpVisibility(true);
            }}>{Localizations_ResetPage("Link-LearnMore")}</Link>
          </>
        }/>
        <Button className="RegisterFormItem" variant="outlined" type="submit">{Localizations_ResetPage("Button_Text-Reset")}</Button>
      </form>
      <Popover className="GenericPopover" open={HelpPopupVisible} anchorReference="anchorPosition" anchorPosition={{ top: HelpPopupAnchorPos.y, left: HelpPopupAnchorPos.x }} onClose={() => {
          setHelpVisibility(false);
        }}>
        <Card className="E2EHelpContainer">
          <Typography variant="body1">{Localizations_ResetPage("TextField_HelperText-ForgottenPasswordWarningExplanationCaption")}</Typography>
          <Typography variant="body2">{Localizations_ResetPage("TextField_HelperText-ForgottenPasswordWarningExplanation")}</Typography>
        </Card>
      </Popover>
    </div>
  );
}
