import { Typography, useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "DataTypes/Components";
import type { IRawChannelProps } from "Interfaces/IRawChannelProps";
import AvatarTextButton from "Components/Buttons/AvatarTextButton/AvatarTextButton";

export interface GenericHeaderProps extends NCComponent {
  title?: string,
}

function GenericHeader({ className, title }: GenericHeaderProps) {
  const theme = useTheme();
  const classNames = useClassNames("GenericHeaderContainer", className);

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper }}>
      <Typography variant="h5">{title}</Typography>
    </div>
  )
}

export default GenericHeader;
