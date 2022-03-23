import { Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import PageContainer from "Components/PageContainer/PageContainer";

import type { View } from "DataTypes/Components";
import { useEffect, useState } from "react";
import GenerateRandomColor from "ColorGeneration";
import { useLocation } from "react-router-dom";

interface AuthViewProps extends View {

}

function AuthView({page, widthConstrained} : AuthViewProps) {
  const Localizations_Common = useTranslation().t;
  const Localizations_AuthView = useTranslation("AuthView").t;
  const theme = useTheme();
  //const [AuthViewCenterContainerBackgroundGradient, setGradient] = useState(`linear-gradient(43deg, ${GenerateRandomColor()} 0%, ${GenerateRandomColor()} 46%, ${GenerateRandomColor()} 100%)`);

  const authViewBrandingContainer = (
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

  return (
    <PageContainer className="AuthViewPageContainer" noPadding>
      <div className="AuthViewCenterContainer" style={{ backgroundImage: AuthViewCenterContainerBackground() }}>
        {!widthConstrained ? authViewBrandingContainer : null}
        <div className="AuthViewFormContainer" style={{ backgroundColor: theme.customPalette.formBackground }}>
          {widthConstrained ? authViewBrandingContainer : null}
          {page}
        </div>
      </div>
    </PageContainer>
  );
}

export default AuthView;
