// Globals
import { Button, Typography, useTheme } from "@mui/material";
import { SendConfirmEmail } from "Lib/API/Endpoints/User";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

// Types
import type { Page } from "Types/UI/Components";
import { Routes } from "Types/UI/Routes";


interface ConfirmPageProps extends Page {

}


export default function ConfirmPage(props: ConfirmPageProps) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const Localizations_ConfirmPage = useTranslation("ConfirmPage").t;

  const [confirmed, setConfirmed] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    (async () => {
      const token = location.search.split("=")[1];
      if (token === undefined || token === "") return;
      const req = await SendConfirmEmail(token);
      if (req) setConfirmed(true);
      else setFailed(true);
    })();
  });

  return (
    <div className="RegisterPageContainer">
      {(confirmed && !failed)?
        (
          <>
            <Typography variant="h6" align="center">{Localizations_ConfirmPage("Typography-ConfirmationSucess")}</Typography>
            <Typography variant="h6" align="center">{Localizations_ConfirmPage("Typography-Welcome")}</Typography>
            <Button className="RegisterFormItem" fullWidth variant="outlined" onClick={() => navigate(Routes.Login)}>{Localizations_ConfirmPage("Button_Text-Login")}</Button>
          </>
        ) :
        (
          <>
            <Typography variant="h6" align="center">{Localizations_ConfirmPage("Typography-WaitForConfirmation")}</Typography>
          </>
        )
      }
      {(failed)?
        (
          <>
            <Typography variant="caption" color="red" align="center">{Localizations_ConfirmPage("Typography-ConfirmationFailed")}</Typography>
            <Button className="RegisterFormItem" color="error" fullWidth variant="outlined" onClick={() => window.location.reload()}>{Localizations_ConfirmPage("Button_Text-TryAgain")}</Button>
          </>
        ) :
        (<></>)
      }
    </div>
  );
}
