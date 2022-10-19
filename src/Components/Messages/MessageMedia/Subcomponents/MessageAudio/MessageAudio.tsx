import { useTheme } from "@mui/material";
import TimeBar from "Components/MediaPlayer/TimeBar/TimeBar";
import useClassNames from "Hooks/useClassNames";

import MessageMediaSkeleton from "Components/Skeletons/MessageMediaSkeleton/MessageMediaSkeleton";

import type { MessageMediaProps } from "../../MessageMedia";

export interface MessageAudioProps extends MessageMediaProps {

}

function MessageAudio(props: MessageAudioProps) {
  const theme = useTheme();
  const classNames = useClassNames("MessageMediaAudioContainer", props.className);
  const loaded = props.contentUrl !== undefined && props.contentUrl.length > 0;

  return (
    <div className={classNames}>
      {!loaded ?
        <>
          <audio className="MessageMediaAudio" controls src={props.contentUrl} />
          <TimeBar duration={10} curTime={2} onTimeUpdate={() => {}}></TimeBar>
        </>
        :
        <MessageMediaSkeleton iconVariant={props.mimeType} skeletonVariant="rounded" />
      }
    </div>
  )
}

export default MessageAudio;
