import { Add as AddIcon } from "@mui/icons-material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import TextCombo, { TextComboChangeEvent } from "Components/Input/TextCombo/TextCombo";

import type { NCComponent } from "Types/UI/Components";
import { RecipientFormErrorStates as RecipientFormErrorStates, TextComboStates } from "Types/Enums";

export interface RecipientFormProps extends NCComponent {
  value?: string,
  errorState?: RecipientFormErrorStates,
  onSubmit?: () => void,
  onChange?: (event: TextComboChangeEvent) => void
}

function RecipientForm(props: RecipientFormProps) {
  const classNames = useClassNames("RecipientFormContainer", props.className);
  const Localizations_AddFriendForm = useTranslation("RecipientForm").t;

  const errorText = () => {
    switch (props.errorState) {
      case RecipientFormErrorStates.Success:
        return Localizations_AddFriendForm("TextField_StatusText__RecipientField-Success");
      case RecipientFormErrorStates.UserNotFound:
        return Localizations_AddFriendForm("TextField_StatusText__RecipientField-UserNotFound");
      case RecipientFormErrorStates.InvalidFormat:
        return Localizations_AddFriendForm("TextField_StatusText__RecipientField-InvalidFormat");
      case RecipientFormErrorStates.Neutral:
      default:
        return "";
    }
  }

  const onSubmit = () => {
    if (props.onSubmit) props.onSubmit();
  }

  return (
    <div className={classNames}>
      <TextCombo submitIcon={<AddIcon />} submitDisabled={props.value !== undefined && props.value.length < 1} autoFocus status={(props.errorState !== undefined && props.errorState > 0) ? TextComboStates.Error : (props.errorState !== undefined && props.errorState === RecipientFormErrorStates.Success) ? TextComboStates.Success : TextComboStates.Neutral} statusText={errorText()} value={props.value} placeholder={Localizations_AddFriendForm("TextField_Placeholder-FriendFormat")} onChange={props.onChange} onSubmit={onSubmit} />
    </div>
  );
}

export default RecipientForm;
