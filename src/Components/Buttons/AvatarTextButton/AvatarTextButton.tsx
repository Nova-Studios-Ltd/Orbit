import { Avatar, ButtonBase, IconButton, Typography, useTheme } from "@mui/material";
import { MoreHoriz as EllipsisIcon } from "@mui/icons-material";
import React, { useState, ReactNode } from "react";

import type { NCComponent } from "DataTypes/Components";
import useClassNames from "Hooks/useClassNames";

export interface AvatarTextButtonProps extends NCComponent {
  children?: ReactNode,
  childrenAfter?: ReactNode,
  draggable?: boolean,
  iconSrc?: string,
  selected?: boolean,
  showEllipsis?: boolean,
  showEllipsisConditional?: boolean,
  onDrag?: (event: React.DragEvent<HTMLDivElement>) => void,
  onDrop?: (event: React.DragEvent<HTMLSpanElement>) => void,
  onLeftClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
  onRightClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

function AvatarTextButton(props: AvatarTextButtonProps) {
  const theme = useTheme();
  const classNames = useClassNames("AvatarTextButtonContainer", props.className);
  const isTouchCapable = props.sharedProps && props.sharedProps.isTouchCapable;

  const [isHovering, setHoveringState] = useState(false);
  const [isDragZoneTopHovering, setDragZoneTopHoveringState] = useState(false);
  const [isDragZoneBottomHovering, setDragZoneBottomHoveringState] = useState(false);

  const onMouseHover = (isHovering: boolean) => {
    setHoveringState(isHovering);
  }

  const onEllipsisClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onRightClick) props.onRightClick(event);
  };

  const onDrag = (event: React.DragEvent<HTMLDivElement>) => {
    if (props.draggable && props.onDrag) props.onDrag(event);
  }

  const onDrop = (event: React.DragEvent<HTMLSpanElement>) => {
    if (props.draggable && props.onDrop) props.onDrop(event);
  }

  return (
    <div className={classNames} style={{ backgroundColor: props.selected || isHovering ? theme.customPalette.customActions.active : theme.palette.background.paper, boxShadow: props.selected ? `4px 4px ${theme.palette.background.default}` : "none" }} draggable={props.draggable} onDragStart={onDrag}>
      {props.draggable ? <span className="AvatarTextButtonDragZone AvatarTextButtonDragZoneTop" style={{ background: isDragZoneTopHovering ? theme.palette.primary.main : "none" }} onDrop={(event) => { onDrop(event); setDragZoneTopHoveringState(false); }} onDragOver={(event) => { setDragZoneTopHoveringState(true); event.preventDefault(); }} onDragLeave={() => setDragZoneTopHoveringState(false)}/> : null}
      <ButtonBase className="AvatarTextButtonBase" onClick={props.onLeftClick} onContextMenu={props.onRightClick} onMouseEnter={() => onMouseHover(true)} onMouseLeave={() => onMouseHover(false)}>
        <div className="AvatarTextButtonLeft">
          <Avatar className="AvatarTextButtonIcon" src={props.iconSrc} />
        </div>
        <div className="AvatarTextButtonRight">
          <Typography variant="h6">{props.children}</Typography>
        </div>
        <div className="AvatarTextButtonVeryRight">
          {props.childrenAfter}
        </div>
      </ButtonBase>
      {props.showEllipsis || (isTouchCapable && props.showEllipsisConditional) ? (
        <div className="AvatarTextButtonEllipsisContainer">
          <IconButton className="AvatarTextButtonEllipsis" onClick={onEllipsisClick} onMouseEnter={() => onMouseHover(true)} onMouseLeave={() => onMouseHover(false)}>
            <EllipsisIcon />
          </IconButton>
        </div>
        ) : null
      }
      {props.draggable ? <span className="AvatarTextButtonDragZone AvatarTextButtonDragZoneBottom" style={{ background: isDragZoneBottomHovering ? theme.palette.primary.main : "none" }} onDrop={(event) => { onDrop(event); setDragZoneBottomHoveringState(false); }} onDragOver={(event) => { setDragZoneBottomHoveringState(true); event.preventDefault(); }} onDragLeave={() => setDragZoneBottomHoveringState(false)}/> : null}
    </div>
  )
}

export default AvatarTextButton;
