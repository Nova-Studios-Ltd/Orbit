import { Typography } from "@mui/material";

import PageContainer from "Components/Containers/PageContainer/PageContainer";
import MessageFile from "Components/Messages/MessageMedia/Subcomponents/MessageFile/MessageFile";

import type { Page } from "DataTypes/Components";

interface ChatPageProps extends Page {

}

function FriendPage({ ContextMenu, HelpPopup, widthConstrained, changeTitleCallback }: ChatPageProps) {
  return (
    <PageContainer noPadding>
      <div className="FriendPageContainer">
        <Typography variant="body1">How Lonely</Typography>
        <MessageFile filename="Test File" filesize={0} url="about:blank" />
      </div>
    </PageContainer>
  );
}

export default FriendPage;
