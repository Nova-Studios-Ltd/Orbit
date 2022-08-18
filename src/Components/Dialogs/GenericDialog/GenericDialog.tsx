import { useTheme, Modal, Typography } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { CSSTransition } from "react-transition-group";

import type { NCComponent } from "DataTypes/Components";
import type { ReactNode } from "react";
import React from "react";

export interface GenericDialogProps extends NCComponent {
  children?: ReactNode,
  title?: string,
  buttons?: ReactNode,
  open: boolean,
  dismissibleAnywhere?: boolean,
  onClose?: () => void
}

function GenericDialog(props: GenericDialogProps) {
  const theme = useTheme();
  const classNames = useClassNames("GenericDialogContainer", props.className);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key.toLowerCase() === "escape") {
      if (props.onClose) props.onClose();
    }
  }

  const onBackdropClick = () => {
    if (props.dismissibleAnywhere && props.onClose) props.onClose();
  }

  return (
    <CSSTransition classNames={classNames} in={props.open} timeout={10}>
      <div className={classNames} style={{ color: theme.palette.text.primary }}>
        <CSSTransition classNames="GenericDialogBackdrop" in={props.open} timeout={10}>
          <div className="GenericDialogBackdrop" onClick={onBackdropClick} style={{ background: theme.palette.background.paper, display: props.sharedProps && props.sharedProps.widthConstrained ? "none" : "block" }}/>
        </CSSTransition>
        <CSSTransition classNames="GenericDialogInnerContainer" in={props.open} timeout={10}>
          <div className="GenericDialogInnerContainer" style={{ backgroundColor: theme.palette.background.paper }} onKeyDown={onKeyDown}>
            <Typography className="GenericDialogTitle" variant="h5">{props.title}</Typography>
            <div className="GenericDialogContentContainer">
              {props.children}
            </div>
            <div className="GenericDialogButtonContainer">
              {props.buttons}
            </div>
          </div>
        </CSSTransition>
      </div>
    </CSSTransition>
  )
}

export default GenericDialog;
