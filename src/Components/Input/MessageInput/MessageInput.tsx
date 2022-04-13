import { TextField, useTheme } from "@mui/material";

import type { NCComponent } from "DataTypes/Components";
import type { ChangeEvent } from "react";

export interface MessageInputSendEvent {
  value?: string,
}

export interface MessageInputChangeEvent {
  value?: string,
}

export interface MessageInputProps extends NCComponent {
  className?: string,
  value?: string,
  onChange?: (event: MessageInputChangeEvent) => void
  onSend?: (event: MessageInputSendEvent) => void
}

function MessageInput({ className, value, onChange, onSend }: MessageInputProps) {
  const theme = useTheme();

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange({ value: event.target.value });
  }

  const onKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key.toLowerCase() === "enter") {
      if (onSend) onSend({ value });
    }
  }

  return (
    <div className={`MessageInputContainer ${className}`} style={{ backgroundColor: theme.palette.background.paper }}>
      <TextField variant="outlined" value={value} onChange={onChangeHandler} onKeyDown={onKeyDownHandler}/>
    </div>
  )
}

export default MessageInput;
