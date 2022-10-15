import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { MessageMediaProps } from "../../MessageMedia";
import { Base64String } from "NSLib/Base64";
import { GETFile } from "NSLib/NCAPI";
import { DecryptBase64WithPriv, DecryptUint8Array } from "NSLib/NCEncryption";
import { AESMemoryEncryptData } from "NSLib/NCEncrytUtil";
import { HasFlag } from "NSLib/NCFlags";
import { SettingsManager } from "NSLib/SettingsManager";
import { useState, useEffect } from "react";

export interface MessageVideoProps extends MessageMediaProps {

}

function MessageVideo({ className, content, contentUrl, fileName, fileSize, mimeType, contentWidth, contentHeight, keys, iv }: MessageVideoProps) {
  const theme = useTheme();
  //const contentRef = useContentRef(content, contentUrl);
  const classNames = useClassNames("MessageMediaVideoContainer", className);
  // Implement alpha content download
  const [contentDataUrl, setContentDataUrl] = useState("");

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
      setContentDataUrl(URL.createObjectURL(new Blob([decryptedContent])));
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper }}>
      <video className="MessageMediaVideo" onClick={(event) => event.preventDefault()} controls src={contentDataUrl} />
      <div className="MessageMediaVideoOverlay">

      </div>
    </div>
  )
}

export default MessageVideo;
