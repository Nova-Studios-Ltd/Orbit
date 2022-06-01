import { Button, useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "DataTypes/Components";
import StatusIndicator, { IndicatorState } from "Components/StatusIndicator/StatusIndicator";

export interface CacheProps extends NCComponent {
  cache_name?: string
}

function Cache(props: CacheProps) {
  const theme = useTheme();
  const classNames = useClassNames("ComponentContainer", props.className);

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.default }}>
      <StatusIndicator state={IndicatorState.Intermedate}>
        {props.cache_name || ""}
        <div>
          <Button>[Refresh]</Button>
          <Button>[Invalidate]</Button>
          <Button>[Delete]</Button>
        </div>
      </StatusIndicator>
    </div>
  )
}

export default Cache;
