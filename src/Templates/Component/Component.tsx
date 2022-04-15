import { useTheme } from "@mui/material";

import type { NCComponent } from "DataTypes/Components";
import useClassNames from "Hooks/useClassNames";

export interface ComponentProps extends NCComponent {

}

function Component({ className }: ComponentProps) {
  const theme = useTheme();
  const classNames = useClassNames("ComponentContainer", className);

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper }}>

    </div>
  )
}

export default Component;
