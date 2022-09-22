import { createContext } from "react";
import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import PageContainer from "Components/Containers/PageContainer/PageContainer";

import type { Page, SharedProps } from "Types/UI/Components";

interface PageProps extends Page {

}

function Page(props: PageProps) {
  const Localizations_Page = useTranslation("Page").t;
  const classNames = useClassNames("PageContainer", props.className);
  const theme = useTheme();

  const SharedPropsContext = createContext({} as SharedProps);

  return (
    <SharedPropsContext.Consumer>
    {
      sharedProps => {
        return (
          <PageContainer className={classNames} noPadding>

          </PageContainer>
        );
      }
    }
  </SharedPropsContext.Consumer>
  );
}

export default Page;
