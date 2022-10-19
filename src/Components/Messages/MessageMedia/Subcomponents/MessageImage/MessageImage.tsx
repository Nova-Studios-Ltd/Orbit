import { Icon, Skeleton, useTheme } from "@mui/material";
import { Image as ImageIcon } from "@mui/icons-material";
import useClassNames from "Hooks/useClassNames";

import MessageMediaSkeleton from "Components/Skeletons/MessageMediaSkeleton/MessageMediaSkeleton";

import type { MessageMediaProps } from "../../MessageMedia";

export interface MessageImageProps extends MessageMediaProps {

}

function MessageImage(props: MessageImageProps) {
  const theme = useTheme();
  const classNames = useClassNames("MessageMediaImageContainer", props.className);
  const loaded = props.contentUrl !== undefined && props.contentUrl.length > 0;

  return (
    <div className={classNames}>
      {loaded ?
        <img className="MessageMediaImage" width={props.contentWidth} height={props.contentHeight} onClick={(event) => event.preventDefault()} src={props.contentUrl} alt={props.fileName} loading="lazy"/>
        :
        <MessageMediaSkeleton iconVariant={props.mimeType} skeletonVariant="rounded" />
      }
    </div>
  )
}

export default MessageImage;
