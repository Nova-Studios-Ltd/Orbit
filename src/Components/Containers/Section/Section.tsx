import { useTheme, Typography } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "DataTypes/Components";
import type { ReactNode } from "react";

export interface SectionProps extends NCComponent {
  title?: string,
  children?: ReactNode
}

function Section(props: SectionProps) {
  const theme = useTheme();
  const classNames = useClassNames("SectionContainer", props.className);

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper }}>
      <Typography className="SectionTitle" variant="h5">{props.title}</Typography>
      {props.children}
    </div>
  )
}

export default Section;
