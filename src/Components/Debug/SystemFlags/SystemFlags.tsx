import { ChangeEvent, useState } from "react";
import { FormControlLabel, Switch, Typography, useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { NCFlags, HasUrlFlag, SetUrlFlag, NCFlag, ClearUrlFlag, GetUrlFlag } from "NSLib/NCFlags";

import { useDispatch, useSelector } from "Redux/Hooks";
import { addParam, removeParam } from "Redux/Slices/RouteSlice";
import { selectParamByKey } from "Redux/Selectors/RoutingSelectors";

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

  const flags = Object.values(NCFlags);

  const flagEl = () => {
    return flags.map((flag: NCFlag) => {
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
