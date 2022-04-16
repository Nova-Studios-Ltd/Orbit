import { IconButton, TextField, useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import type { NCAPIComponent } from "DataTypes/Components";
import { ChangeEvent, useState } from "react";

export interface MessageInputSendEvent {
  value?: string,
}

export interface MessageInputChangeEvent {
  value?: string,
}

export interface MessageInputProps extends NCAPIComponent {
  value?: string,
  onChange?: (event: MessageInputChangeEvent) => void
  onSend?: (event: MessageInputSendEvent) => void
}

function MessageInput({ className, value, onChange, onSend }: MessageInputProps) {
  const Localizations_MessageInput = useTranslation("MessageInput").t;
  const theme = useTheme();
  const classNames = useClassNames("MessageInputContainer", className);

  const [TextFieldFocused, setTextFieldFocusedState] = useState(false);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange({ value: event.target.value });
  }

  const onKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key.toLowerCase() === "enter") {
      if (onSend) onSend({ value });
    }
  }

  const inputFocusHandler = (isFocused: boolean) => {
    setTextFieldFocusedState(isFocused);
  }

  return (
    <div className={classNames} style={{ backgroundColor: theme.customPalette.messageInputBackground, borderColor: TextFieldFocused ? theme.palette.action.active : theme.palette.divider }}>
      <input type="text" className="MessageInputField" style={{ backgroundColor: "transparent", color: theme.palette.text.primary, fontSize: theme.typography.subtitle1.fontSize }} placeholder={Localizations_MessageInput("TextField_Placeholder-TypeHerePrompt")} value={value} onFocus={() => inputFocusHandler(true)} onBlur={() => inputFocusHandler(false)} onChange={onChangeHandler} onKeyDown={onKeyDownHandler} />
      <IconButton></IconButton>
    </div>
  )
}

export default MessageInput;
