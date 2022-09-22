import { createContext } from "react";
import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import type { NCComponent, SharedProps } from "Types/UI/Components";

export interface ComponentProps extends NCComponent {

}

function Component(props: ComponentProps) {
  const theme = useTheme();
  const classNames = useClassNames("ComponentContainer", props.className);
  const Localizations_Component = useTranslation("Component").t;

  const SharedPropsContext = createContext({} as SharedProps);

  return (
    <SharedPropsContext.Consumer>
      {
        sharedProps => {
          return (
            <div className={classNames} style={{ backgroundColor: theme.palette.background.paper }}>

            </div>
          );
        }
      }
    </SharedPropsContext.Consumer>
  )
}

export default Component;
