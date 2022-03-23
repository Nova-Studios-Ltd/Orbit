import { useTheme } from "@mui/material";

import type { NCComponent } from "DataTypes/Components";

export interface ChannelListProps extends NCComponent {

}

function ChannelList({  }: ChannelListProps) {
  const theme = useTheme();

  // TODO: Implement ChannelList

  return (
    <div className="ChannelListContainer" style={{ backgroundColor: theme.palette.background.paper }}>
      [Channel List]
    </div>
  )
}

export default ChannelList;
