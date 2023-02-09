import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import { useDispatch, useSelector } from "Redux/Hooks";

import PageContainer from "Components/Containers/PageContainer/PageContainer";

import type { Page } from "Types/UI/Components";

interface PageProps extends Page {

}

function Page(props: PageProps) {
  const Localizations_Page = useTranslation("Page").t;
  const classNames = useClassNames("PageContainer", props.className);
  const dispatch = useDispatch();
  const theme = useTheme();

  return (
    <PageContainer className={classNames} noPadding>

    </PageContainer>
  );
}

export default Page;
