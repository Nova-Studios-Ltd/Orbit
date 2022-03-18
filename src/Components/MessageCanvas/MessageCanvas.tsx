import { useTheme } from "@mui/material";

import type { NCComponent } from "Types/Components";

export interface MessageCanvasProps extends NCComponent {

}

function MessageCanvas({  }: MessageCanvasProps) {
  const theme = useTheme();

  return (
    <div style={{ backgroundColor: theme.palette.background.paper }}>
      [MessageCanvas]
    </div>
  )
}

export default MessageCanvas;
