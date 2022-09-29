import { Menu, useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { CSSTransition } from "react-transition-group";

import type { NCComponent } from "Types/UI/Components";
import ContextMenuItem, { ContextMenuItemProps } from "../ContextMenuItem/ContextMenuItem";
import { Coordinates } from "Types/General";
import React, { createRef, ReactNode, useEffect, useRef, useState } from "react";

export interface ContextMenuProps extends NCComponent {
  children?: ReactNode,
  open: boolean,
  anchorPos?: Coordinates,
  dim?: boolean,
  onDismiss?: (event: React.FocusEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => void
}

function ContextMenu(props: ContextMenuProps) {
  const theme = useTheme();
  const classNames = useClassNames("ContextMenuContainer", props.className);

  const [anchorPos, setAnchorPos] = useState(props.anchorPos);

  useEffect(() => {
    setAnchorPos(props.anchorPos);
  }, [props, props.anchorPos]);

  const calculatePosition = (menuRef: HTMLDivElement | null) => {
    if (menuRef && anchorPos) {
      const rect = menuRef.getBoundingClientRect();
      const width = Number.parseInt(rect.width.toString());
      const height = Number.parseInt(rect.height.toString());
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let calculatedAnchorPosX = anchorPos.x;
      let calculatedAnchorPosY = anchorPos.y;

      if (anchorPos.x + width > viewportWidth) {
        calculatedAnchorPosX = viewportWidth - width;
      }
      if (anchorPos.y + height > viewportHeight) {
        calculatedAnchorPosY = viewportHeight - height;
      }

      if (calculatedAnchorPosX !== anchorPos.x || calculatedAnchorPosY !== anchorPos.y) {
        setAnchorPos({ x: calculatedAnchorPosX, y: calculatedAnchorPosY }); //TODO: Figure out how to keep context menu within bounds of viewport
      }
    }
  }

  return (
    <CSSTransition classNames={classNames} in={(props.open && anchorPos !== undefined)} timeout={10}>
      <div className={classNames} onClick={props.onDismiss} onContextMenu={props.onDismiss} style={{ left: anchorPos?.x, top: anchorPos?.y }}>
        <div className="ContextMenuBackdrop" style={{ background: props.dim ? theme.palette.background.paper : "none" }}/>
        <div ref={(el) => calculatePosition(el)} className="ContextMenuItemParentContainer" style={{ backgroundColor: theme.customPalette.contextMenuBackground }}>
          {props.children}
        </div>
      </div>
    </CSSTransition>

  )
}

export default ContextMenu;
