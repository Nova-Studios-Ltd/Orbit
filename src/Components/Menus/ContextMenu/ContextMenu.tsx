import { Menu, useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "DataTypes/Components";
import ContextMenuItem, { ContextMenuItemProps } from "../ContextMenuItem/ContextMenuItem";
import { Coordinates } from "DataTypes/Types";
import React, { createRef, useEffect, useRef, useState } from "react";

export interface ContextMenuProps extends NCComponent {
  children?: ContextMenuItemProps[],
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

  const contextMenuItemsList = () => {
    if (!props.children || props.children.length < 1) return null;

    return props.children.map((item, index) => {
      if (item.hide) return null;
      return (<ContextMenuItem key={index} sharedProps={props.sharedProps} className={item.className} disabled={item.disabled} persistOnClick={item.persistOnClick} icon={item.icon} onLeftClick={item.onLeftClick} onRightClick={item.onRightClick}>{item.children}</ContextMenuItem>)
    });
  };

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

  if (!anchorPos || !props.open) return null;

  return (
    <div className={classNames} onClick={props.onDismiss} onContextMenu={props.onDismiss}>
      <div ref={(el) => calculatePosition(el)} className="ContextMenuItemParentContainer" style={{ backgroundColor: theme.customPalette.contextMenuBackground, position: "absolute", left: anchorPos.x, top: anchorPos.y }}>
        {contextMenuItemsList()}
      </div>
      <div className="ContextMenuBackdrop" style={{ backgroundColor: props.dim ? theme.palette.background.paper : "none" }}/>
    </div>
  )
}

export default ContextMenu;
