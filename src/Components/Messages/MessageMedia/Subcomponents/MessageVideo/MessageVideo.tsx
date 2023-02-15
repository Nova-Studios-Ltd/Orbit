import useClassNames from "Hooks/useClassNames";

import MessageMediaSkeleton from "Components/Skeletons/MessageMediaSkeleton/MessageMediaSkeleton";

import type { MessageMediaProps } from "../../MessageMedia";

export interface MessageVideoProps extends MessageMediaProps {

}

function MessageVideo(props: MessageVideoProps) {
  const classNames = useClassNames("MessageMediaVideoContainer", props.className);
  const loaded = props.contentUrl !== undefined && props.contentUrl.length > 0;

  return (
    <div className={classNames}>
      {loaded ?
        <video className="MessageMediaVideo" onClick={(event) => event.preventDefault()} controls>
          <source src={props.contentUrl} type={props.rawMimeType}/>
        </video>
        :
        <MessageMediaSkeleton iconVariant={props.mimeType} skeletonVariant="rounded" />
      }
    </div>
  )
}

export default MessageVideo;
