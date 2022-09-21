import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import PageContainer from "Components/Containers/PageContainer/PageContainer";

import type { Page } from "Types/UI/Components";

interface CreateGroupPageProps extends Page {

}

function CreateGroupPage(props: CreateGroupPageProps) {
  const Localizations_CreateGroupPage = useTranslation("CreateGroupPage").t;
  const classNames = useClassNames("CreateGroupPageContainer", props.className);
  const theme = useTheme();

  return (
    <PageContainer className={classNames} noPadding>

    </PageContainer>
  );
}

export default Page;
