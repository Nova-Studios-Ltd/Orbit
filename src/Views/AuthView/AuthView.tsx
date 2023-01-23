// Global
import { useTheme } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Source
import GenerateRandomColor from "Lib/Utility/ColorGeneration";

// Components
import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";

// Types
import type { View } from "OldTypes/UI/Components";
import { Routes } from "OldTypes/UI/Routes";

interface AuthViewProps extends View {

}

function AuthView(props: AuthViewProps) {
  const Localizations_Common = useTranslation().t;
  const Localizations_AuthView = useTranslation("AuthView").t;
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const AuthViewCenterContainerBackgroundGradient = `linear-gradient(43deg, ${GenerateRandomColor()} 0%, ${GenerateRandomColor()} 46%, ${GenerateRandomColor()} 100%)`

  //const [AuthViewCenterContainerBackgroundGradient, setGradient] = useState(`linear-gradient(43deg, ${GenerateRandomColor()} 0%, ${GenerateRandomColor()} 46%, ${GenerateRandomColor()} 100%)`);

  /*useEffect(() => {
    setGradient(`linear-gradient(43deg, ${GenerateRandomColor()} 0%, ${GenerateRandomColor()} 46%, ${GenerateRandomColor()} 100%)`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useLocation()]);*/

  if (location.pathname === Routes.Auth) navigate(Routes.Login);

  const AuthViewCenterContainerBackground = () => {
    if (CSS.supports("background-image", AuthViewCenterContainerBackgroundGradient)) {
      return AuthViewCenterContainerBackgroundGradient;
    }

    return props.sharedProps?.widthConstrained ? theme.customPalette.formBackground : theme.palette.background.default;
  };

  return (
    <ViewContainer className="AuthViewContainer" noPadding>
    <div className="AuthViewCenterContainer" style={{ backgroundImage: AuthViewCenterContainerBackground() }}>
      <div className="AuthViewFormContainer">
        <div className="AuthViewFormContainerBackground" style={{ backgroundColor: theme.customPalette.formBackground }} />
        <div className="AuthViewBrandingContainer">
          <img className="BrandingImage" src="/OrbitLogo.png" alt={Localizations_AuthView("Image_Alt-BrandingLogo")} />
        </div>
        <Outlet />
      </div>
    </div>
  </ViewContainer>
  );
}

export default AuthView;
