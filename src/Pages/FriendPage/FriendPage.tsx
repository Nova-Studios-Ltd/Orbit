import { Typography } from "@mui/material";
import PageContainer from "Components/Containers/PageContainer/PageContainer";

import type { Page } from "DataTypes/Components";

interface ChatPageProps extends Page {

}

function FriendPage({ ContextMenu, HelpPopup, widthConstrained, changeTitleCallback }: ChatPageProps) {
  return (
    <PageContainer noPadding>
      <div className="FriendPageContainer">
        <Typography variant="body1">How Lonely</Typography>
      </div>
    </PageContainer>
  );
}

export default FriendPage;
