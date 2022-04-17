import PageContainer from "Components/Containers/PageContainer/PageContainer";

import type { Page } from "DataTypes/Components";

interface PageProps extends Page {

}

function Page({ className, ContextMenu, HelpPopup, widthConstrained, changeTitleCallback }: PageProps) {
  const classNames = useClassNames("ViewContainer", className);

  return (
    <PageContainer className={classNames} noPadding>
      <div className="PageContainer">

      </div>
    </PageContainer>
  );
}

export default Page;
