import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import MessageMediaSkeleton from "Components/Skeletons/MessageMediaSkeleton/MessageMediaSkeleton";

import type { MessageMediaProps } from "../../MessageMedia";
import { useState } from "react";
import CustomAudio from "Components/MediaPlayer/CustomAudio/CustomAudio";

export interface MessageAudioProps extends MessageMediaProps {

}

function MessageAudio(props: MessageAudioProps) {
  const theme = useTheme();
  const classNames = useClassNames("MessageMediaAudioContainer", props.className);
  const loaded = props.contentUrl !== undefined && props.contentUrl.length > 0;

  return (
    <div className={classNames}>
      {loaded ?
        <>
          <CustomAudio src={props.contentUrl} filename={props.fileName}></CustomAudio>
        </>
        :
        <MessageMediaSkeleton iconVariant={props.mimeType} skeletonVariant="rounded" />
      }
    </div>
  )
}

export default MessageAudio;
