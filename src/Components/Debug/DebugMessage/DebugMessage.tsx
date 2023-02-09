import { Typography, useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import { useDispatch, useSelector } from "Redux/Hooks";

import type { NCComponent } from "Types/UI/Components";
import { DebugMessageType } from "Types/Enums";
import { DebugMessageSkeleton } from "Types/General";

export interface DebugMessageProps extends NCComponent {
  skeleton: DebugMessageSkeleton
}

function DebugMessage(props: DebugMessageProps) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const classNames = useClassNames("DebugMessageContainer", props.className);
  const Localizations_DebugMessage = useTranslation("DebugMessage").t;

  if (props.skeleton === undefined) return null;

  const messageColor = (() => {
    switch (props.skeleton.type) {
      case DebugMessageType.Log:
        return "primary";
      case DebugMessageType.Warning:
        return "yellow";
      case DebugMessageType.Error:
        return "error";
      case DebugMessageType.Success:
        return "lime";
      default:
        return "primary";
    }
  })()

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper }}>
      <Typography variant="caption" fontWeight="bold" color={messageColor}>[{props.skeleton.type.toUpperCase()}]</Typography>
      {props.skeleton.timestamp ? <Typography variant="caption" fontWeight="bold" color="gray">{new Date(props.skeleton.timestamp).toISOString()}</Typography> : null}
      <Typography variant="caption">{props.skeleton.message}</Typography>
    </div>
  );
}

export default DebugMessage;
