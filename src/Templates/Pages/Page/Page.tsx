import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import PageContainer from "Components/Containers/PageContainer/PageContainer";

import type { Page } from "DataTypes/Components";

interface PageProps extends Page {

}

function Page({ className, ContextMenu, HelpPopup, widthConstrained, changeTitleCallback }: PageProps) {
  const Localizations_Page = useTranslation("Page").t;
  const classNames = useClassNames("PageContainer", className);

  return (
    <PageContainer className={classNames} noPadding>
      <div className="PageContainer">

      </div>
    </PageContainer>
  );
}

export default Page;
