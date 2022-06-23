import useClassNames from "Hooks/useClassNames";
import { Button, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

import PageContainer from "Components/Containers/PageContainer/PageContainer";
import TextCombo, { TextComboChangeEvent } from "Components/Input/TextCombo/TextCombo";

import type { Page } from "DataTypes/Components";
import { useEffect, useState } from "react";

interface AddFriendsPageProps extends Page {
  onAddFriend?: (recipient: string) => void,
}

function AddFriendsPage(props: AddFriendsPageProps) {
  const Localizations_AddFriendsPage = useTranslation("AddFriendsPage").t;
  const classNames = useClassNames("AddFriendsPageContainer", props.className);

  const [RecipientField, setRecipientField] = useState("");

  useEffect(() => {
    if (props.sharedProps && props.sharedProps.changeTitleCallback) props.sharedProps.changeTitleCallback(Localizations_AddFriendsPage("PageTitle"));
  }, [Localizations_AddFriendsPage, props, props.sharedProps?.changeTitleCallback]);

  const handleRecipientFieldChanged = (event: TextComboChangeEvent) => {
    if (event.value !== undefined) setRecipientField(event.value);
  };

  const addFriend = () => {
    if (RecipientField.length > 0 && props.onAddFriend) {
      props.onAddFriend(RecipientField);
      setRecipientField("");
    }
  };

  return (
    <PageContainer className={classNames} adaptive={false}>
      <div className="CreateChannelContainer">
        <TextCombo submitButton={false} autoFocus value={RecipientField} textFieldPlaceholder={Localizations_AddFriendsPage("TextField_Placeholder-FriendFormat")} onChange={handleRecipientFieldChanged} onSubmit={addFriend} childrenRight={
          <Button onClick={addFriend} disabled={RecipientField.length < 1} variant="contained">{Localizations_AddFriendsPage("Button_Label-AddFriend")}</Button>
        }/>
      </div>
    </PageContainer>
  );
}

export default AddFriendsPage;
