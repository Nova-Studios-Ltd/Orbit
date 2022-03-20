import { useTheme } from "@mui/material";

import type { NCComponent } from "Types/Components";

export interface ChannelListProps extends NCComponent {

}

function ChannelList({  }: ChannelListProps) {
  const theme = useTheme();

  return (
    <div className="ChannelListContainer" style={{ backgroundColor: theme.palette.background.paper }}>
      [Channel List]
    </div>
  )
}

export default ChannelList;
