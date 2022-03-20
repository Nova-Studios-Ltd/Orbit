import { Button, TextField } from "@mui/material";

import PageContainer from "Components/PageContainer/PageContainer";
import MessageCanvas from "Components/MessageCanvas/MessageCanvas";
import { AutoLogin } from "Init/AuthHandler";

function ChatPage() {
  AutoLogin();
  return (
    <PageContainer>
      <MessageCanvas />
    </PageContainer>
  );
}

export default ChatPage;
