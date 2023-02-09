import { FormControlLabel, Switch, useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import React, { useCallback } from "react";

import { useDispatch } from "Redux/Hooks";

import type { NCComponent } from "Types/UI/Components";
import { Param } from "Types/UI/Routing";

export interface FlagSwitchProps extends NCComponent {
  flag: Param,
  checked?: boolean,
  onChange?: (flag: Param, action: "set" | "unset") => void
}

function FlagSwitch(props: FlagSwitchProps) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const classNames = useClassNames("FlagSwitchContainer", props.className);

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) props.onChange(props.flag, event.target.checked ? "set" : "unset");
  }, [props]);

  return (
    <div className={classNames}>
      <FormControlLabel className="FlagSwitchInput" control={<Switch checked={props.checked} onChange={onChange} />} label={props.flag.key} />
    </div>
  );
}

export default FlagSwitch;
