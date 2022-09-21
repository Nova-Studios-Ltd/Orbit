import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { ReactNode } from "react";
import type { NCComponent } from "Types/UI/Components";

export interface PageContainerProps extends NCComponent {
  adaptive?: boolean,
  noPadding?: boolean,
  children: ReactNode
}

function PageContainer({ adaptive, noPadding, className, children }: PageContainerProps) {
  const theme = useTheme();
  let classNames = useClassNames("PageContainer", className);

  if (adaptive === null) {
    adaptive = true;
  }

  if (!adaptive) {
    classNames = classNames.concat(" ", "PageContainerNonAdaptive");
  }

  if (noPadding) {
    classNames = classNames.concat(" ", "NoPadding");
  }

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
      {children}
    </div>
  )
}

export default PageContainer;
