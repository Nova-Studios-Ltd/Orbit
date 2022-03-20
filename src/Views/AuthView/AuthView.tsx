import { Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import PageContainer from "Components/PageContainer/PageContainer";

import type { View } from "DataTypes/Components";
import { ReactNode, useRef } from "react";
import GenerateRandomColor from "ColorGeneration";

interface AuthViewProps extends View {

}

function AuthView({page, widthConstrained} : AuthViewProps) {
  const Localizations_Common = useTranslation().t;
  const Localizations_AuthView = useTranslation("AuthView").t;
  const theme = useTheme();

  const authViewBrandingContainer = (
    <div className="AuthViewBrandingContainer">
      <img className="BrandingImage" src="logo192.png" alt={Localizations_AuthView("Image_Alt-BrandingLogo")} />
      <Typography className="BrandingTitle" variant="h3">{Localizations_Common("AppTitle")}</Typography>
    </div>
  );

  const AuthViewCenterContainerBackgroundGradient = `linear-gradient(43deg, ${GenerateRandomColor()} 0%, ${GenerateRandomColor()} 46%, ${GenerateRandomColor()} 100%)`;

  const AuthViewCenterContainerBackground = () => {
    if (CSS.supports("background", AuthViewCenterContainerBackgroundGradient)) {
      return AuthViewCenterContainerBackgroundGradient;
    }

    return widthConstrained ? theme.customPalette.formBackground : theme.palette.background.default;
  };

  return (
    <PageContainer className="AuthViewPageContainer" noPadding>
      <div className="AuthViewCenterContainer" style={{ background: AuthViewCenterContainerBackground() }}>
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
