import { Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import PageContainer from "Components/PageContainer/PageContainer";

import type { View } from "Types/Components";

interface AuthViewProps extends View {

}

function AuthView({page, widthConstrained} : AuthViewProps) {
  const Localizations_Common = useTranslation().t;
  const Localizations_AuthView = useTranslation("AuthView").t;
  const theme = useTheme();

  const authViewBrandingContainer = (
    <div className="AuthViewBrandingContainer">
      <img className="BrandingImage" src="logo.png" alt={Localizations_AuthView("Image_Alt-BrandingLogo")} />
      <Typography className="BrandingTitle" variant="h3">{Localizations_Common("AppTitle")}</Typography>
    </div>
  );

  return (
    <PageContainer>
      <div className="AuthViewCenterContainer" style={{ backgroundColor: widthConstrained ? theme.customPalette.formBackground : theme.palette.background.default }}>
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
