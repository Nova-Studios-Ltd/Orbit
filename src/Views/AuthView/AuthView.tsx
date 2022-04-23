import { Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import LoginPage from "Pages/LoginPage/LoginPage";
import RegisterPage from "Pages/RegisterPage/RegisterPage";
import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";

import type { View } from "DataTypes/Components";
import GenerateRandomColor from "NSLib/ColorGeneration";
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
      <img className="BrandingImage" src="OrbitLogo.png" alt={Localizations_AuthView("Image_Alt-BrandingLogo")} />

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
        <div className="AuthViewFormContainer">
          <div className="AuthViewFormContainerBackground" style={{ backgroundColor: theme.customPalette.formBackground }} />
          {widthConstrained ? AuthViewBrandingContainer : null}
          {page()}
        </div>
      </div>
    </ViewContainer>
  );
}

export default AuthView;
