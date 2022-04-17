import { Button, Typography } from "@mui/material";

import PageContainer from "Components/Containers/PageContainer/PageContainer";

import type { Page } from "DataTypes/Components";

interface ChatPageProps extends Page {
  onChannelCreate?: (recipient: string) => void,
}

function FriendPage({ ContextMenu, HelpPopup, widthConstrained, changeTitleCallback, onChannelCreate }: ChatPageProps) {
  const createChannel = () => {
    if (onChannelCreate) {
      onChannelCreate("");
    }
  }

  return (
    <PageContainer noPadding>
      <div className="FriendPageContainer">
        <Button onClick={createChannel}>Create Channel</Button>
      </div>
    </PageContainer>
  );
}

export default FriendPage;
