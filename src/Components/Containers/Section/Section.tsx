import { useTheme, Typography } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "Types/UI/Components";
import { Children, CSSProperties, ReactNode } from "react";

export interface SectionProps extends NCComponent {
  title?: string,
  styles?: CSSProperties,
  children?: ReactNode,
  childrenRight?: ReactNode
}

function Section(props: SectionProps) {
  const theme = useTheme();
  let classNames = useClassNames("SectionContainer", props.className);

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
    <div className={classNames} style={props.styles}>
      <div className="SectionContainerHeader">
        <Typography className="SectionTitle" variant="h6">{props.title}</Typography>
        <div className="SectionContainerHeaderRight">
          {props.childrenRight}
        </div>
      </div>
      {items()}
    </div>
  )
}

export default Section;
