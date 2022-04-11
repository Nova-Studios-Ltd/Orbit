import { Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import LoginPage from "Pages/LoginPage/LoginPage";
import RegisterPage from "Pages/RegisterPage/RegisterPage";
import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";

import type { View } from "DataTypes/Components";
import { useEffect, useState } from "react";
import GenerateRandomColor from "ColorGeneration";
import { useLocation } from "react-router-dom";
import { AuthViewRoutes } from "DataTypes/Routes";

interface AuthViewProps extends View {
  path: AuthViewRoutes
}

function AuthView({ path, widthConstrained, HelpPopup, changeTitleCallback } : AuthViewProps) {
  const Localizations_Common = useTranslation().t;
  const Localizations_AuthView = useTranslation("AuthView").t;
  const theme = useTheme();
  //const [AuthViewCenterContainerBackgroundGradient, setGradient] = useState(`linear-gradient(43deg, ${GenerateRandomColor()} 0%, ${GenerateRandomColor()} 46%, ${GenerateRandomColor()} 100%)`);

  const AuthViewBrandingContainer = (
    <div className="AuthViewBrandingContainer">
      <img className="BrandingImage" src="logo192.png" alt={Localizations_AuthView("Image_Alt-BrandingLogo")} />
      <Typography className="BrandingTitle" variant="h3">{Localizations_Common("AppTitle")}</Typography>
    </div>
  );

  const AuthViewCenterContainerBackgroundGradient = `linear-gradient(43deg, ${GenerateRandomColor()} 0%, ${GenerateRandomColor()} 46%, ${GenerateRandomColor()} 100%)`

  /*useEffect(() => {
    setGradient(`linear-gradient(43deg, ${GenerateRandomColor()} 0%, ${GenerateRandomColor()} 46%, ${GenerateRandomColor()} 100%)`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useLocation()]);*/

  const AuthViewCenterContainerBackground = () => {
    if (CSS.supports("background-image", AuthViewCenterContainerBackgroundGradient)) {
      return AuthViewCenterContainerBackgroundGradient;
    }

    return widthConstrained ? theme.customPalette.formBackground : theme.palette.background.default;
  };

  const page = () => {
    switch (path) {
      case AuthViewRoutes.Login:
        return (<LoginPage changeTitleCallback={changeTitleCallback} />);
      case AuthViewRoutes.Register:
        return (<RegisterPage changeTitleCallback={changeTitleCallback} HelpPopup={HelpPopup} />);
      default:
        console.warn("[AuthView] Invalid Page");
        return null;
    }
  }

  return (
    <ViewContainer className="AuthViewContainer" noPadding>
      <div className="AuthViewCenterContainer" style={{ backgroundImage: AuthViewCenterContainerBackground() }}>
        {!widthConstrained ? AuthViewBrandingContainer : null}
        <div className="AuthViewFormContainer" style={{ backgroundColor: theme.customPalette.formBackground }}>
          {widthConstrained ? AuthViewBrandingContainer : null}
          {page()}
        </div>
      </div>
    </ViewContainer>
  );
}

export default AuthView;
