import { Icon, Typography, IconButton, useTheme } from "@mui/material";
import { DownloadUint8ArrayFile } from "NSLib/ElectronAPI";
import { Download as DownloadIcon, InsertDriveFile as FileIcon } from '@mui/icons-material';
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import type { NCComponent } from "Types/UI/Components";
import { Base64String } from "NSLib/Base64";
import { GETFile } from "NSLib/NCAPI";
import { DecryptBase64WithPriv, DecryptUint8Array } from "NSLib/NCEncryption";
import { AESMemoryEncryptData } from "NSLib/NCEncrytUtil";
import { HasFlag } from "NSLib/NCFlags";
import { SettingsManager } from "NSLib/SettingsManager";
import { useState, useEffect, useRef } from "react";

export interface MessageFileProps extends NCComponent {
  fileName?: string,
  fileSize?: number,
  content?: Uint8Array,
  url?: string,
  keys?: { [key: string] : string; },
  iv?: string,
}

function MessageFile({ className, fileName, fileSize, content, url: contentUrl, keys, iv }: MessageFileProps) {
  const Localizations_MessageFile = useTranslation("MessageFile").t;
  const theme = useTheme();
  const classNames = useClassNames("MessageFileContainer", className);

  // Implement alpha content download
  const [contentDataUrl, setContentDataUrl] = useState("");
  const contentData = useRef(new Uint8Array());

  useEffect(() => {
    (async () => {
      // Url control variable
      if (HasFlag("no-load-content")) return;

      // First confirm contentUrl/keys/iv is not undefined
      if (contentUrl === undefined || keys === undefined || iv === undefined) return;

      // Now we grab the content itself and decrypt the data
      const manager = new SettingsManager();
      const content = await GETFile(contentUrl, manager.User.token);
      const att_key = await DecryptBase64WithPriv(manager.User.keyPair.PrivateKey, new Base64String(keys[manager.User.uuid]));
      const decryptedContent = await DecryptUint8Array(att_key, new AESMemoryEncryptData(iv, content.payload as Uint8Array));
      contentData.current = decryptedContent;
      setContentDataUrl(URL.createObjectURL(new Blob([decryptedContent])));
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const download = () => {
    if (content) {
      DownloadUint8ArrayFile(contentData.current, fileName);
      return;
    }
    console.warn("File does not contain content to download");
  };

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper }}>
      <div className='MessageFileContainerLeft'>
        <Icon className='MessageFileContainerIcon'>
          <FileIcon />
        </Icon>
      </div>
      <div className='MessageFileContainerRight'>
        <div className='MessageFileContainerTextSection'>
          <Typography variant='subtitle1'>{fileName}</Typography>
          <Typography variant='caption'>{fileSize} {Localizations_MessageFile("Typography-UnitsByte")}</Typography>
        </div>
        <IconButton className='MessageFileContainerDownloadButton' onClick={download}><DownloadIcon /></IconButton>
      </div>
    </div>
  )
}

export default MessageFile;
