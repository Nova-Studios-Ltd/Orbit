import { Avatar, ButtonBase, IconButton, Typography, useTheme } from "@mui/material";
import { ArrowDropDown as DropdownIcon } from "@mui/icons-material";
import React, { createContext, useState, ReactNode } from "react";

import type { NCComponent, SharedProps } from "Types/UI/Components";
import useClassNames from "Hooks/useClassNames";

export interface AvatarTextDropdownProps extends NCComponent {
  children?: ReactNode,
  iconSrc?: string,
  onLeftClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
  onRightClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

function AvatarTextDropdown(props: AvatarTextDropdownProps) {
  const theme = useTheme();
  const classNames = useClassNames("AvatarTextButtonContainer", props.className);

  const SharedPropsContext = createContext({} as SharedProps);

  const [isHovering, setHoveringState] = useState(false);

  const onMouseHover = (isHovering: boolean) => {
    setHoveringState(isHovering);
  }

  const onEllipsisClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onRightClick) props.onRightClick(event);
  };

  return (
    <SharedPropsContext.Consumer>
      {
        sharedProps => {

          const isTouchCapable = sharedProps && sharedProps.isTouchCapable;

          return (
            <div className={classNames} style={{ backgroundColor: isHovering ? theme.customPalette.customActions.active : theme.palette.background.paper }}>
              <ButtonBase className="AvatarDropdownButtonBase" onClick={props.onLeftClick} onContextMenu={props.onRightClick} onMouseEnter={() => onMouseHover(true)} onMouseLeave={() => onMouseHover(false)}>
                <div className="AvatarDropdownButtonLeft">
                  <Avatar className="AvatarDropdownButtonIcon" src={props.iconSrc} />
                </div>
                <div className="AvatarDropdownButtonRight">
                  <Typography variant="h6">{props.children}</Typography>
                </div>
              </ButtonBase>
                <IconButton className="AvatarDropdownButtonEllipsis" onClick={onEllipsisClick} onMouseEnter={() => onMouseHover(true)} onMouseLeave={() => onMouseHover(false)}>
                  <DropdownIcon />
                </IconButton>
            </div>
          );
        }
      }
    </SharedPropsContext.Consumer>
  )
}

export default AvatarTextDropdown;
