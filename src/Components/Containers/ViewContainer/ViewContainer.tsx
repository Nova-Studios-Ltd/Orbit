import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { ReactNode } from "react";
import type { NCComponent } from "DataTypes/Components";

export interface ViewContainerProps extends NCComponent {
  adaptive?: boolean,
  noPadding?: boolean,
  children: ReactNode
}

function ViewContainer({ adaptive, noPadding, className, children }: ViewContainerProps) {
  const theme = useTheme();
  let classNames = useClassNames("ViewContainer", className);

  if (adaptive == null) {
    adaptive = true;
  }

  if (noPadding) {
    classNames = classNames.concat(" ", "NoPadding");
  }

  if (!adaptive) {
    classNames = classNames.concat(" ", "ViewContainerNonAdaptive");
  }

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
      {children}
    </div>
  )
}

export default ViewContainer;
