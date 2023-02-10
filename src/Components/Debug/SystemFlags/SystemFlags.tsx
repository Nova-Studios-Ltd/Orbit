import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { Flags, HasUrlFlag, Flag } from "Lib/Debug/Flags";

import { useDispatch } from "Redux/Hooks";
import { addParam, removeParam } from "Redux/Slices/RouteSlice";

import FlagSwitch from "Components/Input/FlagSwitch/FlagSwitch";

import type { Param } from "Types/UI/Routing";
import type { NCComponent } from "Types/UI/Components";

interface SystemFlagsProps extends NCComponent {

}

function SystemFlags(props: SystemFlagsProps) {
  const classNames = useClassNames("SystemFlagsContainer", props.className);
  const theme = useTheme();
  const dispatch = useDispatch();

  const onChange = (flag: Param, action: "set" | "unset") => {
    if (action === "set") {
      dispatch(addParam(flag.key, undefined, flag.unsetOnNavigate));
    }
    else {
      dispatch(removeParam(flag.key));
    }
  };

  const flags = Object.values(Flags);

  const flagEl = () => {
    return flags.map((flag: Flag) => {
      const newFlag: Param = { key: flag.urlString, value: flag.defaultValue?.toString() };
      return (<FlagSwitch flag={newFlag} checked={HasUrlFlag(flag)} onChange={onChange} />);
    });
  }

  return (
    <div className={classNames}>
      {flagEl()}
    </div>
  );
}

export default SystemFlags;
