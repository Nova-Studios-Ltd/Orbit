import { Button, TextField } from "@mui/material";
import { AutoLogin } from "Init/AuthHandler";
import { useNavigate } from "react-router-dom";

import PageContainer from "Components/PageContainer/PageContainer";
import MessageCanvas from "Components/Messages/MessageCanvas/MessageCanvas";
import ChannelList from "Components/Channels/ChannelList/ChannelList";

import type { Page } from "DataTypes/Components";
import { useEffect } from "react";

interface ChatPageProps extends Page {

}

function ChatPage({}: ChatPageProps) {
  const navigate = useNavigate();

  useEffect(() => {
    AutoLogin().then((result: boolean) => {
      if (!result) navigate("/login");
    });
  });


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
