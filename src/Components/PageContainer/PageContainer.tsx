import { useTheme } from "@mui/material";

import type { ReactNode } from "react";
import type { NCComponent } from "Types/Components";

export interface PageContainerProps extends NCComponent {
  adaptive?: boolean
  children: ReactNode
}

function PageContainer({ adaptive, children }: PageContainerProps) {
  const theme = useTheme();

  if (adaptive == null) {
    adaptive = true;
  }

  return (
    <div className={`PageContainer ${!adaptive ? "PageContainerNonAdaptive" : ""}`} style={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
      {children}
    </div>
  )
}

export default PageContainer;
