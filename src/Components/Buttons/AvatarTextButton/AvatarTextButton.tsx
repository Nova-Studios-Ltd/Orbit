import { Avatar, ButtonBase, IconButton, Typography, useTheme } from "@mui/material";
import { MoreHoriz as EllipsisIcon } from "@mui/icons-material";
import React, { useState, ReactNode } from "react";

import type { NCComponent } from "DataTypes/Components";
import useClassNames from "Hooks/useClassNames";

export interface AvatarTextButtonProps extends NCComponent {
  children?: ReactNode,
  iconSrc?: string,
  selected?: boolean,
  showEllipsis?: boolean,
  showEllipsisConditional?: boolean,
  onLeftClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
  onRightClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

function AvatarTextButton(props: AvatarTextButtonProps) {
  const theme = useTheme();
  const classNames = useClassNames("AvatarTextButtonContainer", props.className);
  const isTouchCapable = props.sharedProps && props.sharedProps.isTouchCapable;

  const [isHovering, setHoveringState] = useState(false);

  const onMouseHover = (isHovering: boolean) => {
    setHoveringState(isHovering);
  }

  const onEllipsisClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onRightClick) props.onRightClick(event);
  };

  return (
    <div className={classNames} style={{ backgroundColor: props.selected || isHovering ? theme.customPalette.customActions.active : theme.palette.background.paper }}>
      <ButtonBase className="AvatarTextButtonBase" onClick={props.onLeftClick} onContextMenu={props.onRightClick} onMouseEnter={() => onMouseHover(true)} onMouseLeave={() => onMouseHover(false)}>
        <div className="AvatarTextButtonLeft">
          <Avatar className="AvatarTextButtonIcon" src={props.iconSrc} />
        </div>
        <div className="AvatarTextButtonRight">
          <Typography variant="h6">{props.children}</Typography>
        </div>
      </ButtonBase>
      {props.showEllipsis || (isTouchCapable && props.showEllipsisConditional) ? (
        <IconButton className="AvatarTextButtonEllipsis" onClick={onEllipsisClick} onMouseEnter={() => onMouseHover(true)} onMouseLeave={() => onMouseHover(false)}>
          <EllipsisIcon />
        </IconButton>) : null
      }
    </div>
  )
}

export default AvatarTextButton;
