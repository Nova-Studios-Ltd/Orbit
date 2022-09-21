import { Typography, useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "Types/UI/Components";
import type { ReactNode } from "react";

export interface GenericHeaderProps extends NCComponent {
  title?: string,
  childrenLeft?: ReactNode,
  childrenRight?: ReactNode,
}

function GenericHeader(props: GenericHeaderProps) {
  const theme = useTheme();
  const classNames = useClassNames("GenericHeaderContainer", props.className);

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper }}>
      <div className="GenericHeaderLeft">
        {props.childrenLeft}
      </div>
      <Typography variant="h5">{props.title}</Typography>
      <div className="GenericHeaderRight">
        {props.childrenRight}
      </div>
    </div>
  )
}

export default GenericHeader;
