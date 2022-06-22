import useClassNames from "Hooks/useClassNames";
import { Button, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

import PageContainer from "Components/Containers/PageContainer/PageContainer";
import TextCombo, { TextComboChangeEvent } from "Components/Input/TextCombo/TextCombo";

import type { Page } from "DataTypes/Components";
import { useEffect, useState } from "react";

interface BlockedUsersPageProps extends Page {

}

function BlockedUsersPage(props: BlockedUsersPageProps) {
  const Localizations_BlockedUsersPage = useTranslation("BlockedUsersPage").t;
  const classNames = useClassNames("BlockedUsersPageContainer", props.className);

  const [RecipientField, setRecipientField] = useState("");

  useEffect(() => {
    if (props.sharedProps && props.sharedProps.changeTitleCallback) props.sharedProps.changeTitleCallback(Localizations_BlockedUsersPage("PageTitle"));
  }, [Localizations_BlockedUsersPage, props, props.sharedProps?.changeTitleCallback]);

  const handleRecipientFieldChanged = (event: TextComboChangeEvent) => {
    if (event.value) setRecipientField(event.value);
  };

  return (
    <PageContainer className={classNames} adaptive={false}>
      [Not Implemented]
    </PageContainer>
  );
}

export default BlockedUsersPage;
