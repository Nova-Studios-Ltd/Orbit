import { Typography, useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "OldTypes/UI/Components";

export interface ToastProps extends NCComponent {

}

function Toast({ className }: ToastProps) {
  const theme = useTheme();
  const classNames = useClassNames("ToastContainer", className);

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}>
      <div className="ToastHeader">
        <Typography variant="h5">I am a toast!</Typography>
      </div>
      <div className="ToastBody">

      </div>
    </div>
  )
}

export default Toast;
