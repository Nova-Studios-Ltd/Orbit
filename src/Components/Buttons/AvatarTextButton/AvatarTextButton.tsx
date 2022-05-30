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

function AvatarTextButton(props: AvatarTextButtonProps) {
  const theme = useTheme();
  const classNames = useClassNames("AvatarTextButtonContainer", props.className);

  const [isHovering, setHoveringState] = useState(false);

  const onMouseHover = (isHovering: boolean) => {
    setHoveringState(isHovering);
  }

  return (
    <ButtonBase className={classNames} style={{ backgroundColor: props.selected || isHovering ? theme.customPalette.customActions.active : theme.palette.background.paper }} onClick={props.onLeftClick} onContextMenu={props.onRightClick} onMouseEnter={() => onMouseHover(true)} onMouseLeave={() => onMouseHover(false)}>
      <div className="AvatarTextButtonLeft">
        <Avatar className="AvatarTextButtonIcon" src={props.iconSrc} />
      </div>
      <div className="AvatarTextButtonRight">
        <Typography variant="h6">{props.children}</Typography>
      </div>
    </ButtonBase>
  )
}

export default AvatarTextButton;
