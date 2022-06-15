import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "DataTypes/Components";

export interface ContextMenuProps extends NCComponent {

}

function ContextMenu(props: ContextMenuProps) {
  const theme = useTheme();
  const classNames = useClassNames("ContextMenuContainer", props.className);

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper }}>

    </div>
  )
}

export default ContextMenu;
