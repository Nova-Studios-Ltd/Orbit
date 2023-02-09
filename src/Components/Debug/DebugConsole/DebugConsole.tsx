import { IconButton, Typography, useTheme } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import DebugConsoleCanvas from "Components/Debug/DebugConsoleCanvas/DebugConsoleCanvas";

import { useDispatch, useSelector } from "Redux/Hooks";
import { closeDebugConsole } from "Redux/Thunks/Console";

import type { NCComponent } from "Types/UI/Components";
import { selectConsoleOpen } from "Redux/Selectors/ConsoleSelectors";

export interface DebugConsoleProps extends NCComponent {

}

function DebugConsole(props: DebugConsoleProps) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const classNames = useClassNames("DebugConsoleContainer", props.className);
  const Localizations_DebugConsole = useTranslation("DebugConsole").t;

  const open = useSelector(selectConsoleOpen());

  if (!open) return null;

  return (
    <div className={classNames} style={{ color: theme.palette.text.primary, background: theme.palette.background.paper }}>
      <div className="DebugConsoleHeader">
        <Typography variant="h5">Debug Console</Typography>
        <IconButton onClick={() => dispatch(closeDebugConsole())} style={{ marginLeft: "auto" }}><CloseIcon /></IconButton>
      </div>
      <DebugConsoleCanvas />
    </div>
  );
}

export default DebugConsole;
