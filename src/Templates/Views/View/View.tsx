import { useTheme } from "@mui/material";

import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";
import useClassNames from "Hooks/useClassNames";

import type { View } from "DataTypes/Components";
import { ViewRoutes } from "DataTypes/UI/Routes";

interface ViewProps extends View {

}

function View(props: ViewProps) {
  const Localizations_View = useTranslation("View").t;
  const classNames = useClassNames("ViewContainer", props.className);
  const theme = useTheme();

  return (
    <ViewContainer className={classNames} noPadding>
      {props.page}
    </ViewContainer>
  );
}

export default View;
