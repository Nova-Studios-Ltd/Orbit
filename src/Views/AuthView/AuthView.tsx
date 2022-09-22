import { createContext } from "react";
import { Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import LoginPage from "./Pages/LoginPage/LoginPage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";

import type { View, SharedProps } from "Types/UI/Components";
import GenerateRandomColor from "NSLib/ColorGeneration";
import { Routes } from "Types/UI/Routes";
import type { ReactNode } from "react";

interface AuthViewProps extends View {

}

function AuthView(props: AuthViewProps) {
  const Localizations_Common = useTranslation().t;
  const Localizations_AuthView = useTranslation("AuthView").t;
  const theme = useTheme();
  const AuthViewCenterContainerBackgroundGradient = `linear-gradient(43deg, ${GenerateRandomColor()} 0%, ${GenerateRandomColor()} 46%, ${GenerateRandomColor()} 100%)`

  const SharedPropsContext = createContext({} as SharedProps);

  //const [AuthViewCenterContainerBackgroundGradient, setGradient] = useState(`linear-gradient(43deg, ${GenerateRandomColor()} 0%, ${GenerateRandomColor()} 46%, ${GenerateRandomColor()} 100%)`);

  /*useEffect(() => {
    setGradient(`linear-gradient(43deg, ${GenerateRandomColor()} 0%, ${GenerateRandomColor()} 46%, ${GenerateRandomColor()} 100%)`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useLocation()]);*/

  return (
    <SharedPropsContext.Consumer>
      {
        sharedProps => {

          const AuthViewCenterContainerBackground = () => {
            if (CSS.supports("background-image", AuthViewCenterContainerBackgroundGradient)) {
              return AuthViewCenterContainerBackgroundGradient;
            }

            return sharedProps?.widthConstrained ? theme.customPalette.formBackground : theme.palette.background.default;
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
      }
    </SharedPropsContext.Consumer>
  );
}

export default AuthView;
