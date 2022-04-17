import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

import PageContainer from "Components/Containers/PageContainer/PageContainer";

import type { Page } from "DataTypes/Components";

interface ChatPageProps extends Page {
  onChannelCreate?: (recipient: string) => void,
}

function FriendPage({ ContextMenu, HelpPopup, widthConstrained, changeTitleCallback, onChannelCreate }: ChatPageProps) {
  const [RecipientField, setRecipientField] = useState("");

  const createChannel = () => {
    if (onChannelCreate) {
      onChannelCreate(RecipientField);
    }
  };

  const handleRecipientFieldChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecipientField(event.currentTarget.value);
  };

  return (
    <PageContainer className="FriendPageContainer" noPadding>
      <div className="CreateChannelContainer">
        <TextField value={RecipientField} onChange={handleRecipientFieldChanged} />
        <Button onClick={createChannel}>[Create Channel]</Button>
      </div>
    </PageContainer>
  );
}

export default FriendPage;
