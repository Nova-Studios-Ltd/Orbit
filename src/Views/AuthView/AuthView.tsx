// Global
import { useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Source
import GenerateRandomColor from "Lib/Utility/ColorGeneration";

// Components
import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";

// Types
import type { View } from "Types/UI/Components";
import { Routes } from "Types/UI/Routing";
import { useDispatch, useSelector } from "Redux/Hooks";
import { navigate } from "Redux/Thunks/Routing";
import { selectPathname } from "Redux/Selectors/RoutingSelectors";

interface AuthViewProps extends View {

}

function AuthView(props: AuthViewProps) {
  const Localizations_Common = useTranslation().t;
  const Localizations_AuthView = useTranslation("AuthView").t;
  const Localizations_LoginPage = useTranslation("LoginPage").t;
  const theme = useTheme();
  const dispatch = useDispatch();

  const pathname = useSelector(selectPathname());
  const widthConstrained = useSelector(state => state.app.widthConstrained);

  const AuthViewCenterContainerBackgroundGradient = `linear-gradient(43deg, ${GenerateRandomColor()} 0%, ${GenerateRandomColor()} 46%, ${GenerateRandomColor()} 100%)`

  //const [AuthViewCenterContainerBackgroundGradient, setGradient] = useState(`linear-gradient(43deg, ${GenerateRandomColor()} 0%, ${GenerateRandomColor()} 46%, ${GenerateRandomColor()} 100%)`);

  /*useEffect(() => {
    setGradient(`linear-gradient(43deg, ${GenerateRandomColor()} 0%, ${GenerateRandomColor()} 46%, ${GenerateRandomColor()} 100%)`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useLocation()]);*/

  if (pathname === Routes.Auth) dispatch(navigate({ pathname: Routes.Login }));

  const AuthViewCenterContainerBackground = () => {
    if (CSS.supports("background-image", AuthViewCenterContainerBackgroundGradient)) {
      return AuthViewCenterContainerBackgroundGradient;
    }

    return widthConstrained ? theme.customPalette.formBackground : theme.palette.background.default;
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
