import { useTheme, Modal, Typography } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "DataTypes/Components";
import type { ReactNode } from "react";

export interface GenericDialogProps extends NCComponent {
  children?: ReactNode,
  title?: string,
  buttons?: ReactNode,
  open: boolean,
}

function GenericDialog(props: GenericDialogProps) {
  const theme = useTheme();
  const classNames = useClassNames("GenericDialogContainer", props.className);

  return (
    <Modal className={classNames} open={props.open} style={{ color: theme.palette.text.primary }}>
      <div className="GenericDialogInnerContainer" style={{ backgroundColor: theme.palette.background.paper }}>
        <Typography className="GenericDialogTitle" variant="h5">{props.title}</Typography>
        <div className="GenericDialogContentContainer">
          {props.children}
        </div>
        <div className="GenericDialogButtonContainer">
          {props.buttons}
        </div>
      </div>
    </Modal>
  )
}

export default GenericDialog;
