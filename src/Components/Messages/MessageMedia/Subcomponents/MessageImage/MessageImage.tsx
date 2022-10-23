import { useState } from "react";
import { Icon, Skeleton, Typography, useTheme } from "@mui/material";
import { Image as ImageIcon } from "@mui/icons-material";
import useClassNames from "Hooks/useClassNames";

import MessageMediaSkeleton from "Components/Skeletons/MessageMediaSkeleton/MessageMediaSkeleton";

import type { MessageMediaProps } from "../../MessageMedia";

export interface MessageImageProps extends MessageMediaProps {

}

function MessageImage(props: MessageImageProps) {
  const theme = useTheme();
  const classNames = useClassNames("MessageMediaImageContainer", props.className);

  const [loaded, setLoadedState] = useState(false);
  const [errorState, setErrorState] = useState(false);

  const imageComponent = () => {
    if (errorState) {
      return (<Typography>[Image Load Error] (add retry button and maybe an icon or something instead of this message)</Typography>);
    }

    if (!props.contentDataUrl || props.contentDataUrl.length < 1) {
      return (<img className={`MessageMediaImage${!loaded ? " IsLoading" : ""}`} width={props.contentWidth} height={props.contentHeight} onClick={(event) => event.preventDefault()} onLoad={() => { setErrorState(false); setLoadedState(true); }} onError={() => setErrorState(true)} src={props.contentUrl} alt={props.fileName} loading="lazy"/>);
    }

    return (<img className={`MessageMediaImage${!loaded ? " IsLoading" : ""}`} width={props.contentWidth} height={props.contentHeight} onClick={(event) => event.preventDefault()} onLoad={() => { setErrorState(false); setLoadedState(true); }} onError={() => setErrorState(true)} src={props.contentDataUrl} alt={props.fileName} loading="lazy"/>);
  }

  return (
    <div className={classNames}>
      {imageComponent()}
      {!loaded && !errorState ? <MessageMediaSkeleton iconVariant={props.mimeType} skeletonVariant="rounded" /> : null}
    </div>
  )
}

export default MessageImage;
