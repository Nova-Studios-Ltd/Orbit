import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "DataTypes/Components";

export interface ToastProps extends NCComponent {

}

function Toast({ className }: ToastProps) {
  const theme = useTheme();
  const classNames = useClassNames("ToastContainer", className);

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper }}>

    </div>
  )
}

export default Toast;
