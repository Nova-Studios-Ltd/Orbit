import { useTheme } from "@mui/material";

import type { ReactNode } from "react";
import type { NCComponent } from "Types/Components";

export interface PageContainerProps extends NCComponent {
  children: ReactNode
}

function PageContainer({ children }: PageContainerProps) {
  const theme = useTheme();

  return (
    <div className="PageContainer" style={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
      {children}
    </div>
  )
}

export default PageContainer;
