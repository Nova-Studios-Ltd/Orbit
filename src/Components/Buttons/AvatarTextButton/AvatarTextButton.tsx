import { Avatar, ButtonBase, IconButton, TouchRippleClasses, Typography, useTheme } from "@mui/material";
import { MoreHoriz as EllipsisIcon } from "@mui/icons-material";
import React, { useState, useRef, ReactNode } from "react";

import type { NCComponent } from "DataTypes/Components";
import useClassNames from "Hooks/useClassNames";
import TouchRipple, { TouchRippleActions } from "@mui/material/ButtonBase/TouchRipple";

export interface AvatarTextButtonProps extends NCComponent {
  children?: ReactNode,
  iconSrc?: string,
  selected?: boolean,
  showEllipsis?: boolean,
  showEllipsisConditional?: boolean,
  onLeftClick?: (event: React.MouseEvent<HTMLDivElement>) => void,
  onRightClick?: (event: React.MouseEvent<HTMLDivElement>) => void
}

function AvatarTextButton(props: AvatarTextButtonProps) {
  const theme = useTheme();
  const classNames = useClassNames("AvatarTextButtonContainer", props.className);
  const isTouchCapable = props.sharedProps && props.sharedProps.isTouchCapable;

  const mainRippleRef = useRef() as React.MutableRefObject<TouchRippleActions>;
  const ellipsisRippleRef = useRef() as React.MutableRefObject<TouchRippleActions>;

  const [mainHovering, setMainHoveringState] = useState(false);
  const [ellipsisHovering, setEllipsisHoveringState] = useState(false);

  const onMainMouseHover = (event: React.MouseEvent<HTMLDivElement>) => {
    const isHovering = event.type.toLowerCase() === "mouseenter" ? true : false;
    setMainHoveringState(isHovering);
    if (!isHovering) {
      if (mainRippleRef.current) mainRippleRef.current.stop(event);
    }
  }

  const onEllipsisMouseHover = (event: React.MouseEvent<HTMLDivElement>) => {
    const isHovering = event.type.toLowerCase() === "mouseenter" ? true : false;
    setEllipsisHoveringState(isHovering);
    if (!isHovering) {
      if (ellipsisRippleRef.current) ellipsisRippleRef.current.stop(event);
    }
  }

  const onMainMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (mainRippleRef.current) mainRippleRef.current.start(event);
    if (event.button === 2 && mainHovering) {
      // Right Click
      if (props.onRightClick) props.onRightClick(event);
    }
  }

  const onMainMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    if (mainRippleRef.current) mainRippleRef.current.stop(event);
    if (event.button === 0 && mainHovering) {
      // Left Click
      if (props.onLeftClick) props.onLeftClick(event);
    }
  }

  const onEllipsisMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (ellipsisRippleRef.current) ellipsisRippleRef.current.start(event);
  }

  const onEllipsisMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    if (ellipsisRippleRef.current) ellipsisRippleRef.current.stop(event);
    if (props.onRightClick && ellipsisHovering) props.onRightClick(event);
  }

  return (
    <div className={classNames} style={{ backgroundColor: props.selected || mainHovering ? theme.customPalette.customActions.avatarTextButtonActive : theme.palette.background.paper }}>
      <div className="AvatarTextButtonBase" onMouseDown={onMainMouseDown} onContextMenu={onMainMouseDown} onMouseUp={onMainMouseUp} onMouseEnter={onMainMouseHover} onMouseLeave={onMainMouseHover}>
        <div className="AvatarTextButtonLeft">
          <Avatar className="AvatarTextButtonIcon" src={props.iconSrc} />
        </div>
        <div className="AvatarTextButtonRight">
          <Typography variant="h6">{props.children}</Typography>
        </div>
      </div>
      {props.showEllipsis || (isTouchCapable && props.showEllipsisConditional) ? (
        <div className="AvatarTextButtonEllipsis" style={{ backgroundColor: mainHovering || ellipsisHovering ? theme.customPalette.customActions.avatarTextButtonActive : theme.palette.background.paper }} onMouseDown={onEllipsisMouseDown} onMouseUp={onEllipsisMouseUp} onMouseEnter={onEllipsisMouseHover} onMouseLeave={onEllipsisMouseHover}>
          <EllipsisIcon />
          <TouchRipple className="AvatarTextButtonRipple" ref={ellipsisRippleRef} />
      </div>
        ) : null
      }
      <TouchRipple className="AvatarTextButtonRipple" ref={mainRippleRef} />
    </div>
  )
}

export default AvatarTextButton;
