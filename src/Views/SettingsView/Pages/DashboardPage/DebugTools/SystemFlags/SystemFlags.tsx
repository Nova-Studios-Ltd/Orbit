import { Typography } from "@mui/material";
import { ClearUrlFlag, SetUrlFlag, HasUrlFlag, GetUrlFlag, Flags, Flag} from "Lib/Debug/Flags";
import { ChangeEvent, useState } from "react";

interface FlagProps {
  flag: Flag,
  value: string,
  active: boolean
}

function SysFlag(props: FlagProps) {

  const [liveValue, setLiveValue] = useState(props.value);
  const [active, setActive] = useState(props.active);

  const onActiveChanged = (e: ChangeEvent<HTMLInputElement>) => {
    if (props.active && !e.target.checked) {
      ClearUrlFlag(props.flag);
      return;
    }
    if (props.flag.isStringValue) {
      SetUrlFlag(props.flag, liveValue);
    }
    else {
      SetUrlFlag(props.flag);
    }
  };

  return (
    <div className="FlagContainer">
      <Typography className="FlagName">{props.flag.urlString}:</Typography>
      {props.flag.isStringValue?
      (
        <>
          <input className="FlagText" type="text" onChange={(e) => {setLiveValue(e.currentTarget.value); setActive(false);}} value={liveValue}></input>
          Active?
          <input type="checkbox" checked={active} onChange={onActiveChanged}></input>
        </>
      ) : (
        <input type="checkbox" checked={props.active} onChange={onActiveChanged}></input>)
      }
    </div>
  );
}

export default function SystemFlags() {

  const flags = [] as JSX.Element[];
  for (let f = 0; f < Object.values(Flags).length; f++) {
    const flag = Object.values(Flags)[f] as Flag;
    flags.push(<SysFlag key={f} flag={flag} value={(HasUrlFlag(flag))? GetUrlFlag<string>(flag) || "" : flag.defaultValue as string} active={HasUrlFlag(flag)}/>);
  }

  return (
    <div>
      {flags}
    </div>
  );
}
