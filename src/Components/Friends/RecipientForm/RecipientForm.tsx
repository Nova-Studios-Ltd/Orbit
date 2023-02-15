import { Add as AddIcon } from "@mui/icons-material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import TextCombo, { TextComboChangeEvent } from "Components/Input/TextCombo/TextCombo";

import type { NCComponent } from "Types/UI/Components";
import { RecipientFormErrorState, TextComboStates } from "Types/Enums";

export interface RecipientFormProps extends NCComponent {
  value?: string,
  errorState?: RecipientFormErrorState,
  fullWidth?: boolean,
  onSubmit?: () => void,
  onChange?: (event: TextComboChangeEvent) => void
}

function RecipientForm(props: RecipientFormProps) {
  const classNames = useClassNames(useClassNames("RecipientFormContainer", props.className), props.fullWidth ? "FullWidth" : "");
  const Localizations_AddFriendForm = useTranslation("RecipientForm").t;

  const errorText = () => {
    switch (props.errorState) {
      case RecipientFormErrorState.Success:
        return Localizations_AddFriendForm("TextField_StatusText__RecipientField-Success");
      case RecipientFormErrorState.UserNotFound:
        return Localizations_AddFriendForm("TextField_StatusText__RecipientField-UserNotFound");
      case RecipientFormErrorState.InvalidFormat:
        return Localizations_AddFriendForm("TextField_StatusText__RecipientField-InvalidFormat");
      case RecipientFormErrorState.Neutral:
      default:
        return "";
    }
  }

  const onSubmit = () => {
    if (props.onSubmit) props.onSubmit();
  }

  return (
    <div className={classNames}>
      <TextCombo submitIcon={<AddIcon />} fullWidth={props.fullWidth} submitDisabled={props.value !== undefined && props.value.length < 1} autoFocus status={(props.errorState !== undefined && props.errorState > 0) ? TextComboStates.Error : (props.errorState !== undefined && props.errorState === RecipientFormErrorState.Success) ? TextComboStates.Success : TextComboStates.Neutral} statusText={errorText()} value={props.value} placeholder={Localizations_AddFriendForm("TextField_Placeholder-FriendFormat")} onChange={props.onChange} onSubmit={onSubmit} />
    </div>
  );
}

export default RecipientForm;
