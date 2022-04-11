import { Button, TextField } from "@mui/material";

import PageContainer from "Components/Containers/PageContainer/PageContainer";
import MessageCanvas from "Components/Messages/MessageCanvas/MessageCanvas";
import ChannelList, { ChannelListProps } from "Components/Channels/ChannelList/ChannelList";

import type { Page } from "DataTypes/Components";

interface ChatPageProps extends Page {
  channelData?: ChannelListProps
}

function ChatPage({ channelData }: ChatPageProps) {
  return (
    <PageContainer noPadding>
      <div className="ChatPageContainer">
        <div className="ChatPageContainerLeft">
          <ChannelList channels={channelData?.channels} onChannelClick={channelData?.onChannelClick} />
        </div>
        <div className="ChatPageContainerRight">
          <MessageCanvas />
        </div>
      </div>
    </PageContainer>
  );
}

export default ChatPage;
