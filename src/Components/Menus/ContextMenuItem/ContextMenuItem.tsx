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

function ContextMenuItem(props: ContextMenuItemProps) {
  const theme = useTheme();
  const classNames = useClassNames("ContextMenuItemContainer", props.className);

  const persistOnClick = props.persistOnClick === undefined ? false : true;

  const [backgroundColor, setBackgroundColor] = useState(theme.customPalette.contextMenuItemBackground);

  const handleLeftClick = () => {
    if (props.onLeftClick) props.onLeftClick();
    if (props.persistOnClick) return;
    props.sharedProps?.ContextMenu?.closeMenu();
  }

  const handleRightClick = () => {
    if (props.onRightClick) props.onRightClick();
    if (props.persistOnClick) return;
    props.sharedProps?.ContextMenu?.closeMenu();
  }

  const handleFocus = (isFocused: boolean) => {
    if (isFocused) {
      setBackgroundColor(theme.customPalette.customActions.contextMenuItemActive);
    } else {
      setBackgroundColor(theme.customPalette.contextMenuItemBackground);
    }
  }

  return (
    <MenuItem className={classNames} style={{ backgroundColor: backgroundColor }} disabled={props.disabled} onClick={handleLeftClick} onContextMenu={handleRightClick} onMouseEnter={() => handleFocus(true)} onFocus={() => handleFocus(true)} onMouseLeave={() => handleFocus(false)} onBlur={() => handleFocus(false)}>
      {props.icon}
      {props.children}
    </MenuItem>
  )
}

export default ContextMenuItem;
