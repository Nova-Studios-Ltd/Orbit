import { Avatar, ButtonBase, Typography, useTheme } from "@mui/material";
import { useState, ReactNode } from "react";

import type { NCComponent } from "DataTypes/Components";
import useClassNames from "Hooks/useClassNames";

export interface AvatarTextButtonProps extends NCComponent {
  children?: ReactNode,
  iconSrc?: string,
  selected?: boolean,
  onLeftClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
  onRightClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

function AvatarTextButton({ ContextMenu, className, children, iconSrc, selected, onLeftClick, onRightClick }: AvatarTextButtonProps) {
  const theme = useTheme();
  const classNames = useClassNames("AvatarTextButtonContainer", className);

  const [isHovering, setHoveringState] = useState(false);

  const mouseHoverEventHandler = (isHovering: boolean) => {
    setHoveringState(isHovering);
  }

  return (
    <ButtonBase className={classNames} style={{ backgroundColor: selected || isHovering ? theme.customPalette.customActions.active : theme.palette.background.paper }} onClick={onLeftClick} onContextMenu={onRightClick} onMouseEnter={() => mouseHoverEventHandler(true)} onMouseLeave={() => mouseHoverEventHandler(false)}>
      <div className="AvatarTextButtonLeft">
        <Avatar className="AvatarTextButtonIcon" src={iconSrc} />
      </div>
      <div className="AvatarTextButtonRight">
        <Typography variant="h6">{children}</Typography>
      </div>
    </ButtonBase>
  )
}

export default AvatarTextButton;
