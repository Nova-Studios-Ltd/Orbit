import { Icon, Skeleton, useTheme } from "@mui/material";
import { AttachFile as GenericFile, AudioFile as AudioFileIcon, InsertDriveFile as DocumentFileIcon, Image as ImageFileIcon, VideoFile as VideoFileIcon } from "@mui/icons-material";
import useClassNames from "Hooks/useClassNames";

import { FileType } from "Lib/Utility/MimeTypeParser";
import { NCComponent } from "OldTypes/UI/Components";

export interface MessageMediaSkeletonProps extends NCComponent {
  skeletonVariant?: "text" | "rounded" | "rectangular" | "circular",
  iconVariant?: FileType
}

function MessageMediaSkeleton(props: MessageMediaSkeletonProps) {
  const theme = useTheme();
  const classNames = useClassNames("MessageMediaUnloadedSkeleton", props.className);

  const icon = () => {
    switch (props.iconVariant) {
      case FileType.Audio:
        return <AudioFileIcon />;
      case FileType.Document:
        return <DocumentFileIcon />;
      case FileType.Image:
        return <ImageFileIcon />;
      case FileType.Video:
        return <VideoFileIcon />;
      case FileType.Unknown:
      default:
        return <GenericFile />;
    }
  }

  return (
    <div className={classNames}>
      <Skeleton variant="rounded" width="100%" height="100%" />
      <Icon className="UnloadedMediaIconOverlay">{icon()}</Icon>
    </div>
  )
}

export default MessageMediaSkeleton;
