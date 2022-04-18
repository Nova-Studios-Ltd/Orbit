import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "DataTypes/Components";
import { ComputeCSSDims } from "NSLib/Util";
import Dimensions from "DataTypes/Dimensions";
import { useRef } from "react";

export interface MessageMediaProps extends NCComponent {
  content?: Uint8Array,
  contentUrl?: string,
  filename?: string,
  size?: number,
  contentWidth?: number,
  contentHeight?: number
}

function MessageMedia({ className, content, contentUrl, filename, size, contentWidth, contentHeight }: MessageMediaProps) {
  const theme = useTheme();
  const classNames = useClassNames("MessageMediaContainer", className);

  const imageUrl = useRef((content !== undefined)? URL.createObjectURL(new Blob([content])): "https://www.akc.org/wp-content/uploads/2018/05/samoyed-mother-dog-with-puppy-outdoors.jpg");

  let styles = {}
  if (contentWidth !== undefined && contentHeight !== undefined) {
    const size = ComputeCSSDims(new Dimensions(contentWidth, contentHeight), new Dimensions(575, 400));
    styles = {width: size.width > 0 ? size.width : '18rem', height: size.height > 0 ? size.height : '30rem'};
  }

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper, ...styles }}>
      <img className="MessageMediaImage" src={imageUrl.current} alt={filename} />
    </div>
  )
}

export default MessageMedia;
