import { Button, FormControlLabel, Switch, useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "DataTypes/Components";
import { SettingsManager } from "NSLib/SettingsManager";
import { useState } from "react";
import Cache from "./Cache";
import { GetCaches } from "./CacheLib";

export interface ComponentProps extends NCComponent {

}

function CacheTools(props: ComponentProps) {
  const theme = useTheme();
  const classNames = useClassNames("ComponentContainer", props.className);
  const [caches, setCaches] = useState([] as string[]);

  const checkCache = async () => {
    setCaches(await GetCaches());
  }

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.default }}>
      <Button onClick={checkCache}>[Check Cache]</Button>
      {caches.map(x => {
        return (<><Cache cache_name={x}></Cache><br/></>)
      })}
    </div>
  )
}

export default CacheTools;
