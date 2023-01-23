import { Avatar, ButtonBase, IconButton, Typography, useTheme } from "@mui/material";
import { MoreHoriz as EllipsisIcon } from "@mui/icons-material";
import React, { useState, ReactNode, useRef } from "react";

import type { NCComponent } from "OldTypes/UI/Components";
import useClassNames from "Hooks/useClassNames";
import { SelectionType } from "OldTypes/Enums";

export interface GenericButtonProps extends NCComponent {
  children?: ReactNode,
  draggable?: boolean,
  fullWidth?: boolean,
  defaultHoverAction?: boolean,
  onDrag?: (event: React.DragEvent<HTMLDivElement>) => void,
  onDrop?: (event: React.DragEvent<HTMLSpanElement>) => void,
  onLeftClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
  onRightClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
  onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>) => void,
  onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

function GenericButton(props: GenericButtonProps) {
  const theme = useTheme();
  const classNames = useClassNames(useClassNames("GenericButtonContainer", props.className), props.fullWidth ? "FullWidth" : "");

  const [isHovering, setHoveringState] = useState(false);
  const [isDragZoneTopHovering, setDragZoneTopHoveringState] = useState(false);
  const [isDragZoneBottomHovering, setDragZoneBottomHoveringState] = useState(false);

  const onMouseHover = (isHovering: boolean) => {
    setHoveringState(isHovering);
  }

  const onDrag = (event: React.DragEvent<HTMLDivElement>) => {
    if (props.draggable && props.onDrag) props.onDrag(event);
  }

  const onDrop = (event: React.DragEvent<HTMLSpanElement>) => {
    if (props.draggable && props.onDrop) props.onDrop(event);
  }

  return (
    <div className={classNames} style={{ background: props.defaultHoverAction === false ? "inherit" : (isHovering ? theme.customPalette.customActions.active : theme.palette.background.paper) }} draggable={props.draggable} onDragStart={onDrag}>
      {props.draggable ? <span className="GenericButtonDragZone GenericButtonDragZoneTop" style={{ background: isDragZoneTopHovering ? theme.palette.primary.main : "none" }} onDrop={(event) => { onDrop(event); setDragZoneTopHoveringState(false); }} onDragOver={(event) => { setDragZoneTopHoveringState(true); event.preventDefault(); }} onDragLeave={() => setDragZoneTopHoveringState(false)}/> : null}
      <ButtonBase className="GenericButtonBase" onClick={props.onLeftClick} onContextMenu={props.onRightClick} onMouseEnter={props.onMouseEnter !== undefined ? props.onMouseEnter : () => onMouseHover(true)} onMouseLeave={props.onMouseLeave !== undefined ? props.onMouseLeave : () => onMouseHover(false)}>
        {props.children}
      </ButtonBase>
      {props.draggable ? <span className="GenericButtonDragZone GenericButtonDragZoneBottom" style={{ background: isDragZoneBottomHovering ? theme.palette.primary.main : "none" }} onDrop={(event) => { onDrop(event); setDragZoneBottomHoveringState(false); }} onDragOver={(event) => { setDragZoneBottomHoveringState(true); event.preventDefault(); }} onDragLeave={() => setDragZoneBottomHoveringState(false)}/> : null}
    </div>
  );
}

export default GenericButton;
