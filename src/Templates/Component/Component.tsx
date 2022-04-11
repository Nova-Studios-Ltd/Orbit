import { useTheme } from "@mui/material";

import type { NCComponent } from "DataTypes/Components";

export interface ComponentProps extends NCComponent {

}

function Component({  }: ComponentProps) {
  const theme = useTheme();

  return (
    <div className="ComponentContainer" style={{ backgroundColor: theme.palette.background.paper }}>

    </div>
  )
}

export default Component;
