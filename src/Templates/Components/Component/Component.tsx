import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import type { NCComponent } from "Types/UI/Components";

export interface ComponentProps extends NCComponent {

}

function Component(props: ComponentProps) {
  const theme = useTheme();
  const classNames = useClassNames("ComponentContainer", props.className);
  const Localizations_Component = useTranslation("Component").t;

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper }}>

    </div>
  );
}

export default Component;
