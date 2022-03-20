import { useTheme } from "@mui/material";

import type { NCComponent } from "DataTypes/Components";

export interface MessageProps extends NCComponent {

}

function Message({  }: MessageProps) {
  const theme = useTheme();

  return (
    <div className="MessageContainer" style={{ backgroundColor: theme.palette.background.paper }}>

    </div>
  )
}

export default Message;
