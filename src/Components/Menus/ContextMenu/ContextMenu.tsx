import { Menu, useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "DataTypes/Components";
import ContextMenuItem, { ContextMenuItemProps } from "../ContextMenuItem/ContextMenuItem";
import { Coordinates } from "DataTypes/Types";
import React, { createRef } from "react";

export interface ContextMenuProps extends NCComponent {
  open: boolean,
  anchorPos?: Coordinates,
  items?: ContextMenuItemProps[],
  dim?: boolean,
  onDismiss?: (event: React.FocusEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => void
}

function ContextMenu(props: ContextMenuProps) {
  const theme = useTheme();
  const classNames = useClassNames("ContextMenuContainer", props.className);

  const contextMenuItemsList = () => {
    if (!props.items || props.items.length < 1) return null;

    return props.items.map((item, index) => {
      if (item.hide) return null;
      return (<ContextMenuItem key={index} sharedProps={props.sharedProps} className={item.className} disabled={item.disabled} persistOnClick={item.persistOnClick} icon={item.icon} onLeftClick={item.onLeftClick} onRightClick={item.onRightClick}>{item.children}</ContextMenuItem>)
    });
  };

  if (!props.anchorPos || !props.open) return null;

  return (
    <div className={classNames} onClick={props.onDismiss} onContextMenu={props.onDismiss}>
      <div className="ContextMenuItemParentContainer" style={{ backgroundColor: theme.customPalette.contextMenuBackground, position: "absolute", left: props.anchorPos.x, top: props.anchorPos.y }}>
        {contextMenuItemsList()}
      </div>
      <div className="ContextMenuBackdrop" style={{ backgroundColor: props.dim ? theme.palette.background.paper : "none" }}/>
    </div>
  )
}

export default ContextMenu;
