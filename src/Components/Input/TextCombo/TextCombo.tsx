import { IconButton, Typography, useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import { Send as SendIcon, UploadFile as UploadIcon } from "@mui/icons-material";

import type { NCAPIComponent } from "DataTypes/Components";
import { ChangeEvent, useEffect, useState, ReactNode, useRef } from "react";

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
  autoFocus?: boolean,
  fullWidth?: boolean,
  isPassword?: boolean,
  error?: boolean,
  errorText?: string,
  onChange?: (event: TextComboChangeEvent) => void,
  onDismiss?: (event: TextComboDismissEvent) => void,
  onSubmit?: (event: TextComboSubmitEvent) => void
}

function TextCombo(props: TextComboProps) {
  const Localizations_TextCombo = useTranslation("TextCombo").t;
  const theme = useTheme();
  const classNames = useClassNames(useClassNames("TextComboContainer", props.className), props.fullWidth ? "FullWidth" : undefined);
  const MaxTextFieldCharLength = props.maxLength ? props.maxLength : 4000; // How many characters remaining before it is shown
  const TextFieldCharLengthDisplayThreshold = Math.floor(MaxTextFieldCharLength * 0.2); // How many characters remaining before it is shown
  const TextFieldType = props.isPassword ? "password" : "text";

  const [TextFieldFocused, setTextFieldFocusedState] = useState(false);
  const [TextFieldCharLength, setTextFieldCharLength] = useState(0);

  const TextFieldRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const RemainingTextFieldCharLength = MaxTextFieldCharLength - TextFieldCharLength;

  useEffect(() => {
    if (props.value) setTextFieldCharLength(props.value.length);

    if (props.autoFocus && TextFieldRef.current) TextFieldRef.current.focus();
  }, [props, props.autoFocus, props.value]);

  const submit = () => {
    if (props.onSubmit) props.onSubmit({ value: props.value });
  };

  const dismiss = () => {
    if (props.onDismiss) props.onDismiss({ value: props.value });
  }

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) props.onChange({ value: event.target.value });
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
    <div className={classNames}>
      <div className="TextComboTop">
        {props.error && props.errorText ? <Typography className="TextComboFieldErrorText" color="error" variant="caption">{props.errorText}</Typography> : null}
      </div>
      <div className="TextComboBottom" style={{ backgroundColor: theme.customPalette.TextComboBackground, borderColor: props.error ? theme.palette.error.main : (TextFieldFocused ? theme.palette.action.active : theme.palette.divider) }}>
        <div className="TextComboBefore">
          {props.childrenLeft}
        </div>
        <input type={TextFieldType} className="TextComboField" ref={TextFieldRef} maxLength={MaxTextFieldCharLength} style={{ backgroundColor: "transparent", color: theme.palette.text.primary, fontSize: theme.typography.subtitle1.fontSize }} placeholder={props.textFieldPlaceholder} value={props.value} onFocus={() => inputFocusHandler(true)} onBlur={() => inputFocusHandler(false)} onChange={onChangeHandler} onKeyDown={onKeyDownHandler} />
        <div className="TextComboAfter">
          {RemainingTextFieldCharLength < TextFieldCharLengthDisplayThreshold ? <Typography variant="caption" alignSelf="center">{RemainingTextFieldCharLength}</Typography> : null}
          {props.childrenRight}
          <span>
            {props.submitButton === false ? null : <IconButton title={Localizations_TextCombo("TextCombo-Tooltip-SubmitGeneric")} aria-label={Localizations_TextCombo("TextCombo-Tooltip-SubmitGeneric")} onClick={() => submit()}><SendIcon /></IconButton>}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TextCombo;
