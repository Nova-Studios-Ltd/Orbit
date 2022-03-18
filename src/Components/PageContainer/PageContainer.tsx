import { useTheme } from "@mui/material";

import type { ReactNode } from "react";
import type { NCComponent } from "Types/Components";

export interface PageContainerProps extends NCComponent {
  adaptive?: boolean,
  className?: string,
  children: ReactNode
}

function PageContainer({ adaptive, className, children }: PageContainerProps) {
  const theme = useTheme();

  if (adaptive == null) {
    adaptive = true;
  }

  let classNames = "PageContainer";

  if (className && className.length > 0) {
    classNames = classNames.concat(" ", className);
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
