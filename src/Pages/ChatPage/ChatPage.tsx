import { Button, TextField } from "@mui/material";

import PageContainer from "Components/PageContainer/PageContainer";
import MessageCanvas from "Components/Messages/MessageCanvas/MessageCanvas";
import ChannelList from "Components/Channels/ChannelList/ChannelList";

import type { Page } from "Types/Components";
import { AutoLogin } from "Init/AuthHandler";

interface ChatPageProps extends Page {

}

function ChatPage({}: ChatPageProps) {
  AutoLogin();
  return (
    <PageContainer>
      <div className="ChatPageContainer">
        <div className="ChatPageContainerLeft">
          <ChannelList />
        </div>
        <div className="ChatPageContainerRight">
          <MessageCanvas />
        </div>
      </div>
    </PageContainer>
  );
}

export default ChatPage;
