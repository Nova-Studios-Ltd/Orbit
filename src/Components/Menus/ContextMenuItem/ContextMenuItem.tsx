import React, { ReactNode, useState } from "react";
import { MenuItem, useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "DataTypes/Components";
import type { ReactSVGElement } from "react";

export interface ContextMenuItemProps extends NCComponent {
  children?: ReactNode,
  icon?: ReactSVGElement,
  persistOnClick?: boolean,
  disabled?: boolean,
  hide?: boolean,
  onLeftClick?: () => void,
  onRightClick?: () => void,
}

function ContextMenuItem({ ContextMenu, className, children, icon, persistOnClick, disabled, onLeftClick, onRightClick }: ContextMenuItemProps) {
  const theme = useTheme();
  const classNames = useClassNames("ContextMenuItemContainer", className);

  const [backgroundColor, setBackgroundColor] = useState(theme.customPalette.contextMenuItemBackground);

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

  const handleFocus = (isFocused: boolean) => {
    if (isFocused) {
      setBackgroundColor(theme.customPalette.customActions.contextMenuItemActive);
    } else {
      setBackgroundColor(theme.customPalette.contextMenuItemBackground);
    }
  }

  return (
    <MenuItem className={classNames} style={{ backgroundColor: backgroundColor }} disabled={disabled} onClick={handleLeftClick} onContextMenu={handleRightClick} onMouseEnter={() => handleFocus(true)} onFocus={() => handleFocus(true)} onMouseLeave={() => handleFocus(false)} onBlur={() => handleFocus(false)}>
      {icon}
      {children}
    </MenuItem>
  )
}

export default ContextMenuItem;
