import PageContainer from "Components/Containers/PageContainer/PageContainer";

import type { Page } from "DataTypes/Components";

interface ChatPageProps extends Page {

}

function FriendPage({ ContextMenu, HelpPopup, widthConstrained, changeTitleCallback }: ChatPageProps) {
  return (
    <PageContainer noPadding>
      <div className="FriendPageContainer">

      </div>
    </PageContainer>
  );
}

export default FriendPage;
