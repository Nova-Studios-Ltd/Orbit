import { useState } from "react";
import useClassNames from "Hooks/useClassNames";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import PageContainer from "Components/Containers/PageContainer/PageContainer";

import { FriendAdd } from "Redux/Thunks/Friends";

import type { Page } from "Types/UI/Components";
import type { TextComboChangeEvent } from "Components/Input/TextCombo/TextCombo";
import AddFriendForm from "Components/Friends/AddFriendForm/AddFriendForm";
import { AddFriendFormErrorStates } from "Types/Enums";

interface AddFriendsPageProps extends Page {

}

function AddFriendsPage(props: AddFriendsPageProps) {
  const Localizations_AddFriendsPage = useTranslation("AddFriendsPage").t;
  const classNames = useClassNames("AddFriendsPageContainer", props.className);

  const [RecipientFieldErrorState, setRecipientFieldErrorState] = useState(AddFriendFormErrorStates.Neutral);
  const [RecipientField, setRecipientField] = useState("");

  const handleRecipientFieldChanged = (event: TextComboChangeEvent) => {
    if (event.value !== undefined) {
      setRecipientField(event.value);
      setRecipientFieldErrorState(-1);
    }
  };

  const addFriend = () => {
    if (RecipientField.length > 0) {
      FriendAdd(RecipientField).then((result) => {
        setRecipientFieldErrorState(result);

        if (result === 0) {
          setRecipientField("");
          return;
        }
      });
    }
  };

  return (
    <PageContainer className={classNames} adaptive={false}>
      <Typography variant="body1">{Localizations_AddFriendsPage("Typography-AddFriendBlurb")}</Typography>
      <AddFriendForm onAddFriend={addFriend} onChange={handleRecipientFieldChanged} value={RecipientField} errorState={RecipientFieldErrorState} />
    </PageContainer>
  );
}

export default AddFriendsPage;
