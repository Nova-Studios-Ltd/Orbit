import React, { ReactNode } from "react";
import { MenuItem, useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "DataTypes/Components";
import type { ReactSVGElement } from "react";

export interface ContextMenuItemProps extends NCComponent {
  children?: ReactNode,
  icon?: ReactSVGElement,
  persistOnClick?: boolean,
  onLeftClick?: () => void,
  onRightClick?: () => void,
}

function ContextMenuItem({ ContextMenu, className, children, icon, persistOnClick, onLeftClick, onRightClick }: ContextMenuItemProps) {
  const theme = useTheme();
  const classNames = useClassNames("ContextMenuItemContainer", className);

  if (persistOnClick === undefined) {
    persistOnClick = false;
  }

  const handleLeftClick = () => {
    if (onLeftClick) onLeftClick();
    if (persistOnClick) return;
    ContextMenu?.closeMenu();
  }

  const handleRightClick = () => {
    if (onRightClick) onRightClick();
    if (persistOnClick) return;
    ContextMenu?.closeMenu();
  }

  return (
    <MenuItem className={classNames} style={{ backgroundColor: theme.customPalette.contextMenuItemBackground }} onClick={handleLeftClick} onContextMenu={handleRightClick}>
      {icon}
      {children}
    </MenuItem>
  )
}

export default ContextMenuItem;
