import { IconButton, Typography, useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import { Send as SendIcon, UploadFile as UploadIcon } from "@mui/icons-material";

import type { NCAPIComponent } from "DataTypes/Components";
import { ChangeEvent, useEffect, useState, ReactNode } from "react";

export interface TextComboSubmitEvent {
  value?: string,
}

export interface TextComboChangeEvent {
  value?: string,
}

export interface TextComboDismissEvent {
  value?: string,
}

export interface TextComboProps extends NCAPIComponent {
  childrenLeft?: ReactNode,
  childrenRight?: ReactNode,
  value?: string,
  submitButton?: boolean,
  maxLength?: number,
  textFieldPlaceholder?: string,
  onChange?: (event: TextComboChangeEvent) => void,
  onDismiss?: (event: TextComboDismissEvent) => void,
  onSubmit?: (event: TextComboSubmitEvent) => void
}

function TextCombo({ className, childrenLeft, childrenRight, value, submitButton, maxLength, textFieldPlaceholder, onChange, onDismiss, onSubmit }: TextComboProps) {
  const Localizations_TextCombo = useTranslation("TextCombo").t;
  const theme = useTheme();
  const classNames = useClassNames("TextComboContainer", className);
  const MaxTextFieldCharLength = maxLength ? maxLength : 4000; // How many characters remaining before it is shown
  const TextFieldCharLengthDisplayThreshold = Math.floor(MaxTextFieldCharLength * 0.2); // How many characters remaining before it is shown

  const [TextFieldFocused, setTextFieldFocusedState] = useState(false);
  const [TextFieldCharLength, setTextFieldCharLength] = useState(0);

  const RemainingTextFieldCharLength = MaxTextFieldCharLength - TextFieldCharLength;

  useEffect(() => {
    if (value) setTextFieldCharLength(value.length);
  }, [value]);

  const submit = () => {
    if (onSubmit) onSubmit({ value });
  };

  const dismiss = () => {
    if (onDismiss) onDismiss({ value });
  }

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange({ value: event.target.value });
  };

  const onKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key.toLowerCase()) {
      case "enter":
        submit();
        break;
      case "escape":
        dismiss();
        break;
    }
  };

  const inputFocusHandler = (isFocused: boolean) => {
    setTextFieldFocusedState(isFocused);
  };

  return (
    <div className={classNames} style={{ backgroundColor: theme.customPalette.TextComboBackground, borderColor: TextFieldFocused ? theme.palette.action.active : theme.palette.divider }}>
      <div className="TextComboBefore">
        {childrenLeft}
      </div>
      <input type="text" className="TextComboField" maxLength={MaxTextFieldCharLength} style={{ backgroundColor: "transparent", color: theme.palette.text.primary, fontSize: theme.typography.subtitle1.fontSize }} placeholder={textFieldPlaceholder} value={value} onFocus={() => inputFocusHandler(true)} onBlur={() => inputFocusHandler(false)} onChange={onChangeHandler} onKeyDown={onKeyDownHandler} />
      <div className="TextComboAfter">
        {RemainingTextFieldCharLength < TextFieldCharLengthDisplayThreshold ? <Typography variant="caption" alignSelf="center">{RemainingTextFieldCharLength}</Typography> : null}
        {childrenRight}
        {submitButton === false ? null : <IconButton title={Localizations_TextCombo("TextCombo-Tooltip-SubmitGeneric")} aria-label={Localizations_TextCombo("TextCombo-Tooltip-SubmitGeneric")} onClick={() => submit()}><SendIcon /></IconButton>}
      </div>
    </div>
  )
}

export default TextCombo;
