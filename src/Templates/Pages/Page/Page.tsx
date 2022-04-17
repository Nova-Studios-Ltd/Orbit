import PageContainer from "Components/Containers/PageContainer/PageContainer";

import type { Page } from "DataTypes/Components";

interface PageProps extends Page {

}

function Page({ ContextMenu, HelpPopup, widthConstrained, changeTitleCallback }: PageProps) {
  return (
    <PageContainer noPadding>
      <div className="PageContainer">

      </div>
    </PageContainer>
  );
}

export default Page;
