import { IconButton, TextField, Typography, useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import { Send as SendIcon, UploadFile as UploadIcon } from "@mui/icons-material";

import type { NCAPIComponent } from "DataTypes/Components";
import { ChangeEvent, useEffect, useState } from "react";

export interface MessageInputSendEvent {
  value?: string,
}

export interface MessageInputChangeEvent {
  value?: string,
}

export interface MessageInputProps extends NCAPIComponent {
  value?: string,
  onFileUpload?: () => void,
  onChange?: (event: MessageInputChangeEvent) => void
  onSend?: (event: MessageInputSendEvent) => void
}

const MaxTextFieldCharLength = 4000; // How many characters remaining before it is shown
const TextFieldCharLengthDisplayThreshold = Math.floor(MaxTextFieldCharLength * 0.2); // How many characters remaining before it is shown

function MessageInput({ className, value, onFileUpload, onChange, onSend }: MessageInputProps) {
  const Localizations_MessageInput = useTranslation("MessageInput").t;
  const theme = useTheme();
  const classNames = useClassNames("MessageInputContainer", className);

  const [TextFieldFocused, setTextFieldFocusedState] = useState(false);
  const [TextFieldCharLength, setTextFieldCharLength] = useState(0);

  const RemainingTextFieldCharLength = MaxTextFieldCharLength - TextFieldCharLength;

  useEffect(() => {
    if (value) setTextFieldCharLength(value.length);
  }, [value]);

  const sendMessage = () => {
    if (onSend) onSend({ value });
  };

  const uploadFile = () => {
    if (onFileUpload) onFileUpload();
  };

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange({ value: event.target.value });
  };

  const onKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key.toLowerCase() === "enter") {
      sendMessage();
    }
  };

  const inputFocusHandler = (isFocused: boolean) => {
    setTextFieldFocusedState(isFocused);
  };

  return (
    <div className={classNames} style={{ backgroundColor: theme.customPalette.messageInputBackground, borderColor: TextFieldFocused ? theme.palette.action.active : theme.palette.divider }}>
      <IconButton onClick={() => uploadFile()}><UploadIcon /></IconButton>
      <input type="text" className="MessageInputField" maxLength={MaxTextFieldCharLength} style={{ backgroundColor: "transparent", color: theme.palette.text.primary, fontSize: theme.typography.subtitle1.fontSize }} placeholder={Localizations_MessageInput("TextField_Placeholder-TypeHerePrompt")} value={value} onFocus={() => inputFocusHandler(true)} onBlur={() => inputFocusHandler(false)} onChange={onChangeHandler} onKeyDown={onKeyDownHandler} />
      {RemainingTextFieldCharLength < TextFieldCharLengthDisplayThreshold ? <Typography variant="caption" alignSelf="center">{RemainingTextFieldCharLength}</Typography> : null}
      <IconButton onClick={() => sendMessage()}><SendIcon /></IconButton>
    </div>
  )
}

export default MessageInput;
