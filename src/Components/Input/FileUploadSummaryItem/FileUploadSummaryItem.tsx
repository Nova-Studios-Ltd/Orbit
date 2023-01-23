import { IconButton, Typography, useTheme } from "@mui/material";
import { Close as CloseIcon, InsertDriveFile as FileIcon } from "@mui/icons-material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import type { NCComponent } from "OldTypes/UI/Components";
import { ChangeEvent, useEffect, useState } from "react";
import type MessageAttachment from "OldTypes/API/MessageAttachment";

export interface FileUploadSummaryItemProps extends NCComponent {
  fileHandle?: MessageAttachment,
  onFileRemove?: (id: string) => void
}

function FileUploadSummaryItem({ className, fileHandle, onFileRemove }: FileUploadSummaryItemProps) {
  const Localizations_FileUploadSummaryItem = useTranslation("FileUploadSummaryItem").t;
  const theme = useTheme();
  const classNames = useClassNames("FileUploadSummaryItemContainer", className);

  const [isPreviewable, setPreviewableState] = useState(true);

  const fileName = fileHandle && fileHandle.filename ? fileHandle.filename : "";
  const fileContents = fileHandle && fileHandle.contents ? fileHandle.contents : new Uint8Array([]);
  const fileSize = fileHandle && fileHandle.contents ? fileHandle.contents.length : -1;
  const fileID = fileHandle && fileHandle.id ? fileHandle.id : "";

  const fileContentBlob = URL.createObjectURL(new Blob([fileContents]));

  const onPreviewFail = () => {
    setPreviewableState(false);
  };

  const FilePreview = () => {
    if (isPreviewable) {
      return <img className="FileUploadSummaryItemImagePreview" onError={onPreviewFail} src={fileContentBlob} alt="File Preview" />;
    }
    return <FileIcon className="FileUploadSummaryItemImagePreviewFallback" />;
  };

  return (
    <div className={classNames} style={{ backgroundColor: theme.customPalette.FileUploadSummaryItemBackground }}>
      <div className="FileUploadSummaryItemLeft">
        {FilePreview()}
      </div>
      <div className="FileUploadSummaryItemRight">
        <Typography variant="subtitle2" noWrap>{fileName}</Typography>
        <IconButton onClick={() => onFileRemove ? onFileRemove(fileID) : null}><CloseIcon /></IconButton>
      </div>
    </div>
  )
}

export default FileUploadSummaryItem;
