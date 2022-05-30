import { useTheme, Typography } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "DataTypes/Components";
import { Children, ReactNode } from "react";

export interface SectionProps extends NCComponent {
  title?: string,
  children?: ReactNode
}

function Section(props: SectionProps) {
  const theme = useTheme();
  const classNames = useClassNames("SectionContainer", props.className);

  const items = () => {
    if (props.children) {
      return Children.map(props.children, (item) => {
        return (
          <div className="SectionContainerItem">
            {item}
          </div>
        )
      });
    }
  }

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper }}>
      <Typography className="SectionTitle" variant="h6">{props.title}</Typography>
      {items()}
    </div>
  )
}

export default Section;
