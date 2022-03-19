import { useTheme } from "@mui/material";

import type { NCComponent } from "Types/Components";

export interface MessageCanvasProps extends NCComponent {

}

function MessageCanvas({  }: MessageCanvasProps) {
  const theme = useTheme();

  return (
    <div className="MessageCanvasContainer" style={{ backgroundColor: theme.palette.background.paper }}>
      <div className="TheActualMessageCanvas">
        [Message Canvas]
      </div>
    </div>
  )
}

export default MessageCanvas;
