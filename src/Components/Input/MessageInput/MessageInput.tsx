import { IconButton, Typography, useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";
import MessageAttachment from "DataTypes/MessageAttachment";

import { Send as SendIcon, UploadFile as UploadIcon } from "@mui/icons-material";

import type { NCAPIComponent } from "DataTypes/Components";
import { ChangeEvent, useEffect, useState } from "react";
import TextCombo, { TextComboChangeEvent, TextComboSubmitEvent } from "../TextCombo/TextCombo";
import FileUploadSummaryItem from "../FileUploadSummaryItem/FileUploadSummaryItem";

export interface MessageInputSendEvent extends TextComboSubmitEvent {

}

export interface MessageInputChangeEvent extends TextComboChangeEvent {

}

export interface MessageInputProps extends NCAPIComponent {
  attachments?: MessageAttachment[],
  onFileUpload?: () => void,
  onFileRemove?: (id: string) => void,
  onChange?: (event: MessageInputChangeEvent) => void,
  onSend?: (event: MessageInputSendEvent) => void
}

function MessageInput({ className, attachments, onFileUpload, onFileRemove, onChange, onSend }: MessageInputProps) {
  const Localizations_MessageInput = useTranslation("MessageInput").t;
  const theme = useTheme();
  const classNames = useClassNames("MessageInputContainer", className);

  const [TextFieldValue, setTextFieldValue] = useState("" as string | undefined);

  const summaryItems = () => {
    if (!attachments) return null;

    return attachments.map((attachment) => {
      return <FileUploadSummaryItem key={attachment.id} fileHandle={attachment} onFileRemove={onFileRemove} />
    });
  }

  const sendMessage = (event: MessageInputSendEvent) => {
    if (onSend) onSend({ value: TextFieldValue });
    setTextFieldValue("");
  };

  const uploadFile = () => {
    if (onFileUpload) onFileUpload();
  };

  const onChangeHandler = (event: MessageInputChangeEvent) => {
    if (onChange) onChange({ value: event.value });
    setTextFieldValue(event.value);
  };

  return (
    <div className={classNames}>
      <div className="FileUploadSummaryContainer">
        {summaryItems()}
      </div>
      <TextCombo className="MessageInputField" textFieldPlaceholder={Localizations_MessageInput("TextField_Placeholder-TypeHerePrompt")} value={TextFieldValue} onChange={onChangeHandler} onSubmit={sendMessage}
        childrenLeft={
          <>
            <IconButton title={Localizations_MessageInput("IconButton-Tooltip-UploadFile")} aria-label={Localizations_MessageInput("IconButton-Tooltip-UploadFile")} onClick={() => uploadFile()}><UploadIcon /></IconButton>
          </>
        }
      />
    </div>
  )
}

export default MessageInput;
