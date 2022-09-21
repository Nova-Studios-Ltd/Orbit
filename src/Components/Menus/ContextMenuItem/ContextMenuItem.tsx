import React, { ReactNode, useState } from "react";
import { MenuItem, useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "Types/UI/Components";
import type { ReactSVGElement } from "react";

export interface ContextMenuItemProps extends NCComponent {
  children?: ReactNode,
  icon?: ReactSVGElement,
  disabled?: boolean,
  hide?: boolean,
  onLeftClick?: () => void,
  onRightClick?: () => void,
}

function ContextMenuItem(props: ContextMenuItemProps) {
  const theme = useTheme();
  const classNames = useClassNames("ContextMenuItemContainer", props.className);

  const [backgroundColor, setBackgroundColor] = useState(theme.customPalette.contextMenuItemBackground);

  if (props.hide) return null;

  const handleLeftClick = () => {
    if (props.onLeftClick) props.onLeftClick();
  }

  const handleRightClick = () => {
    if (props.onRightClick) props.onRightClick();
  }

  const handleFocus = (isFocused: boolean) => {
    if (isFocused) {
      setBackgroundColor(theme.customPalette.customActions.contextMenuItemActive);
    } else {
      setBackgroundColor(theme.customPalette.contextMenuItemBackground);
    }
  }

  return (
    <MenuItem className={classNames} style={{ color: theme.palette.text.primary, backgroundColor: backgroundColor }} disabled={props.disabled} onClick={handleLeftClick} onContextMenu={handleRightClick} onMouseEnter={() => handleFocus(true)} onFocus={() => handleFocus(true)} onMouseLeave={() => handleFocus(false)} onBlur={() => handleFocus(false)}>
      {props.icon}
      {props.children}
    </MenuItem>
  )
}

export default ContextMenuItem;
