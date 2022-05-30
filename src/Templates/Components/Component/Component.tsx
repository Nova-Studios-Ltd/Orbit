import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "DataTypes/Components";

export interface ComponentProps extends NCComponent {

}

function Component(props: ComponentProps) {
  const theme = useTheme();
  const classNames = useClassNames("ComponentContainer", props.className);

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper }}>

    </div>
  )
}

export default Component;
