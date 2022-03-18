import { Button, TextField } from "@mui/material";

import PageContainer from "Components/PageContainer/PageContainer";
import MessageCanvas from "Components/MessageCanvas/MessageCanvas";

function ChatPage() {
  return (
    <PageContainer>
      <MessageCanvas />
    </PageContainer>
  );
}

export default ChatPage;
