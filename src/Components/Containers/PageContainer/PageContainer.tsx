import { useTheme } from "@mui/material";

import type { ReactNode } from "react";
import type { NCComponent } from "DataTypes/Components";

export interface PageContainerProps extends NCComponent {
  adaptive?: boolean,
  noPadding?: boolean,
  className?: string,
  children: ReactNode
}

function PageContainer({ adaptive, noPadding, className, children }: PageContainerProps) {
  const theme = useTheme();

  if (adaptive == null) {
    adaptive = true;
  }

  let classNames = "PageContainer";

  if (className && className.length > 0) {
    classNames = classNames.concat(" ", className);
  }

  if (noPadding) {
    classNames = classNames.concat(" ", "NoPadding");
  }

  if (!adaptive) {
    classNames = classNames.concat(" ", "PageContainerNonAdaptive");
  }

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
      {children}
    </div>
  )
}

export default PageContainer;
