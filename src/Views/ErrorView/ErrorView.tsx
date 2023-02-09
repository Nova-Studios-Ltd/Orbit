import { Button } from "@mui/material";
import { Home as HomeIcon, ChevronLeft as BackIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

import { useDispatch } from "Redux/Hooks";
import { navigate } from "Redux/Thunks/Routing";

import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";
import E404 from "Views/ErrorView/Pages/E404/E404";

import type { View } from "Types/UI/Components";
import { Routes, SpecialRoutes } from "Types/UI/Routing";

interface ErrorViewProps extends View {
  errorCode: number
}

function ErrorView({ errorCode }: ErrorViewProps) {
  const Localizations_ErrorView = useTranslation("ErrorView").t;
  const dispatch = useDispatch();

  const errorPage = (() => {
    switch (errorCode) {
      case 404:
      default:
        return <E404 />
    }
  })();

  return (
    <ViewContainer className="ErrorViewContainer" adaptive={false}>
      {errorPage}
      <div className="ErrorViewQuicklinksContainer">
        <Button className="BackButton" onClick={() => dispatch(navigate({ pathname: SpecialRoutes.Back }))} variant="outlined"><BackIcon /> {Localizations_ErrorView("Button_Text-Back")}</Button>
        <Button className="HomeButton" onClick={() => dispatch(navigate({ pathname: Routes.Root }))} variant="outlined"><HomeIcon /> {Localizations_ErrorView("Button_Text-Home")}</Button>
      </div>
    </ViewContainer>
  );
}

export default ErrorView;
