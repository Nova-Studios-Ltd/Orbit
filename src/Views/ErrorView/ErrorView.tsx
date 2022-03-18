import { Button } from "@mui/material";
import { Home as HomeIcon, ChevronLeft as BackIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import PageContainer from "Components/PageContainer/PageContainer";
import E404 from "Pages/ErrorPages/E404/E404";

import type { View } from "Types/Components";

interface ErrorViewProps extends View {
  errorCode: number
}

function ErrorView({ errorCode } : ErrorViewProps) {
  const Localizations_ErrorView = useTranslation("ErrorView").t;
  const navigate = useNavigate();

  const errorPage = (() => {
    switch (errorCode) {
      case 404:
      default:
        return <E404 />
    }
  })();

  return (
    <PageContainer className="ErrorViewContainer" adaptive={false}>
      {errorPage}
      <div className="ErrorViewQuicklinksContainer">
        <Button className="BackButton" onClick={() => navigate(-1)} variant="outlined"><BackIcon /> {Localizations_ErrorView("Button_Text-Back")}</Button>
        <Button className="HomeButton" onClick={() => navigate("/")} variant="outlined"><HomeIcon /> {Localizations_ErrorView("Button_Text-Home")}</Button>
      </div>
    </PageContainer>
  );
}

export default ErrorView;
