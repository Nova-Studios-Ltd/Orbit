import { IconButton, Typography, useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import { Send as SendIcon, UploadFile as UploadIcon } from "@mui/icons-material";

import type { NCComponent } from "DataTypes/Components";
import { ChangeEvent, useEffect, useState } from "react";

export interface FileUploadSummaryProps extends NCComponent {

}

function FileUploadSummary({ className }: FileUploadSummaryProps) {
  const Localizations_FileUploadSummary = useTranslation("FileUploadSummary").t;
  const theme = useTheme();
  const classNames = useClassNames("FileUploadSummaryContainer", className);

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.default }}>

    </div>
  )
}

export default FileUploadSummary;
