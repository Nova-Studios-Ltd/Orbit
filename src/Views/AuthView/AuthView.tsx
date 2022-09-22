import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";

import type { View } from "Types/UI/Components";
import GenerateRandomColor from "NSLib/ColorGeneration";

interface AuthViewProps extends View {

}

function AuthView(props: AuthViewProps) {
  const Localizations_Common = useTranslation().t;
  const Localizations_AuthView = useTranslation("AuthView").t;
  const theme = useTheme();
  const AuthViewCenterContainerBackgroundGradient = `linear-gradient(43deg, ${GenerateRandomColor()} 0%, ${GenerateRandomColor()} 46%, ${GenerateRandomColor()} 100%)`

  //const [AuthViewCenterContainerBackgroundGradient, setGradient] = useState(`linear-gradient(43deg, ${GenerateRandomColor()} 0%, ${GenerateRandomColor()} 46%, ${GenerateRandomColor()} 100%)`);

  /*useEffect(() => {
    setGradient(`linear-gradient(43deg, ${GenerateRandomColor()} 0%, ${GenerateRandomColor()} 46%, ${GenerateRandomColor()} 100%)`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useLocation()]);*/

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
          <img className="BrandingImage" src="OrbitLogo.png" alt={Localizations_AuthView("Image_Alt-BrandingLogo")} />
        </div>
        {props.page}
      </div>
    </div>
  </ViewContainer>
  );
}

export default AuthView;
