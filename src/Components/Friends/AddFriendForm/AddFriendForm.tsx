import { Button } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import TextCombo, { TextComboChangeEvent } from "Components/Input/TextCombo/TextCombo";

import type { NCComponent } from "Types/UI/Components";
import { AddFriendFormErrorStates, TextComboStates } from "Types/Enums";

export interface AddFriendFormProps extends NCComponent {
  value?: string,
  errorState?: AddFriendFormErrorStates,
  onAddFriend?: () => void,
  onChange?: (event: TextComboChangeEvent) => void
}

function AddFriendForm(props: AddFriendFormProps) {
  const classNames = useClassNames("AddFriendFormContainer", props.className);
  const Localizations_AddFriendForm = useTranslation("AddFriendForm").t;

  const errorText = () => {
    switch (props.errorState) {
      case AddFriendFormErrorStates.Success:
        return Localizations_AddFriendForm("TextField_StatusText__RecipientField-Success");
      case AddFriendFormErrorStates.FriendNotFound:
        return Localizations_AddFriendForm("TextField_StatusText__RecipientField-FriendNotFound");
      case AddFriendFormErrorStates.InvalidFormat:
        return Localizations_AddFriendForm("TextField_StatusText__RecipientField-InvalidFormat");
      case AddFriendFormErrorStates.Neutral:
      default:
        return "";
    }
  }

  const addFriend = () => {
    if (props.onAddFriend) props.onAddFriend();
  }

  return (
    <div className={classNames}>
      <TextCombo submitButton={false} autoFocus status={(props.errorState !== undefined && props.errorState > 0) ? TextComboStates.Error : (props.errorState !== undefined && props.errorState === AddFriendFormErrorStates.Success) ? TextComboStates.Success : TextComboStates.Neutral} statusText={errorText()} value={props.value} placeholder={Localizations_AddFriendForm("TextField_Placeholder-FriendFormat")} onChange={props.onChange} onSubmit={addFriend} childrenRight={
        <Button className="AddFriendButton" onClick={addFriend} disabled={!props.value || props.value.length < 1} variant="contained">{Localizations_AddFriendForm("Button_Label-AddFriend")}</Button>
      }/>
    </div>
  );
}

export default AddFriendForm;
