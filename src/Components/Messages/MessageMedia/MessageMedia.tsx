import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "DataTypes/Components";

export interface MessageMediaProps extends NCComponent {

}

function MessageMedia({ className }: MessageMediaProps) {
  const theme = useTheme();
  const classNames = useClassNames("MessageMediaContainer", className);

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper }}>
      [Media]
    </div>
  )
}

export default MessageMedia;
