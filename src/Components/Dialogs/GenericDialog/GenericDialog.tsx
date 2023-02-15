import React, { useEffect, useRef, useState } from "react";
import { useTheme, Typography } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { CSSTransition } from "react-transition-group";

import { useSelector } from "Redux/Hooks";

import type { NCComponent } from "Types/UI/Components";
import type { ReactNode } from "react";

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

  const widthConstrained = useSelector(state => state.app.widthConstrained);

  const [scrollbarMargin, setScrollbarMargin] = useState(0);

  const ContentScrollContainerRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    if (!ContentScrollContainerRef.current) return;

    if (ContentScrollContainerRef.current.scrollHeight > ContentScrollContainerRef.current.clientHeight) {
      setScrollbarMargin(5); // TODO: Perhaps come up with a way to use theme variables for margin instead of hardcoding it here
      return;
    }

    setScrollbarMargin(0);
  }, [ContentScrollContainerRef.current?.scrollHeight, ContentScrollContainerRef.current?.clientHeight]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key.toLowerCase() === "escape") {
      if (props.onClose) props.onClose();
    }
  }

  const onBackdropClick = () => {
    if (props.dismissibleAnywhere && props.onClose) props.onClose();
  }

  return (
    <CSSTransition classNames={classNames} in={props.open} unmountOnExit timeout={{ enter: 0, exit: 200 }}>
      <div className={classNames} style={{ color: theme.palette.text.primary }}>
        <CSSTransition classNames="GenericDialogBackdrop" in={props.open} timeout={{ enter: 200, exit: 0 }}>
          <div className="GenericDialogBackdrop" onClick={onBackdropClick} style={{ background: theme.palette.background.paper, display: widthConstrained ? "none" : "block" }}/>
        </CSSTransition>
        <CSSTransition classNames="GenericDialogInnerContainer" in={props.open} timeout={{ enter: 200, exit: 0 }}>
          <div className="GenericDialogInnerContainer" style={{ backgroundColor: theme.palette.background.paper }} onKeyDown={onKeyDown}>
            <Typography className="GenericDialogTitle" variant="h5">{props.title}</Typography>
            <div className="GenericDialogContentScrollContainer" ref={ContentScrollContainerRef}>
              <div className="GenericDialogContentContainer" style={{ marginRight: scrollbarMargin }}>
                {props.children}
              </div>
            </div>
            <div className="GenericDialogButtonOuterContainer" style={{ background: theme.palette.background.paper }}>
              <div className="GenericDialogButtonContainer">
                {props.buttons}
              </div>
            </div>
          </div>
        </CSSTransition>
      </div>
    </CSSTransition>
  );
}

export default GenericDialog;
