import useClassNames from "Hooks/useClassNames";

import CustomAudio from "Components/MediaPlayer/CustomAudio/CustomAudio";
import MessageMediaSkeleton from "Components/Skeletons/MessageMediaSkeleton/MessageMediaSkeleton";

import type { MessageMediaProps } from "../../MessageMedia";

export interface MessageAudioProps extends MessageMediaProps {

}

function MessageAudio(props: MessageAudioProps) {
  const classNames = useClassNames("MessageMediaAudioContainer", props.className);
  const loaded = props.contentUrl !== undefined && props.contentUrl.length > 0;

  return (
    <div className={classNames}>
      {loaded ?
        <>
          <CustomAudio src={props.contentUrl} filename={props.fileName} type={props.rawMimeType}></CustomAudio>
        </>
        :
        <MessageMediaSkeleton iconVariant={props.mimeType} skeletonVariant="rounded" />
      }
    </div>
  )
}

export default MessageAudio;
