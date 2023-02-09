import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import DebugMessage from "Components/Debug/DebugMessage/DebugMessage";

import { useSelector } from "Redux/Hooks";
import { selectAllDebugMessages } from "Redux/Selectors/ConsoleSelectors";

import type { NCComponent } from "Types/UI/Components";

export interface DebugConsoleCanvasProps extends NCComponent {

}

function DebugConsoleCanvas(props: DebugConsoleCanvasProps) {
  const theme = useTheme();
  const classNames = useClassNames("DebugConsole", props.className);

  const messages = useSelector(selectAllDebugMessages());

  const messageEl = messages.map((skeleton, index) => {
    return (<DebugMessage key={index} skeleton={skeleton}/>);
  })

  return (
    <div className={classNames} style={{ color: theme.palette.text.primary, background: theme.palette.background.paper }}>
      {messageEl}
    </div>
  );
}

export default DebugConsoleCanvas;
