import { Button, useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "DataTypes/Components";
import StatusIndicator, { IndicatorState } from "Components/StatusIndicator/StatusIndicator";
import { indigo } from "@mui/material/colors";

export enum CacheStatus {
  Ok,
  Missing,
  OutOfDate
}

export interface CacheProps extends NCComponent {
  cache_name?: string,
  status?: CacheStatus,
  refreshCache?: (cache: string) => void
  invalidateCache?: (cache: string) => void,
  deleteCache?: (cache: string) => void
}

function Cache(props: CacheProps) {
  const theme = useTheme();
  const classNames = useClassNames("ComponentContainer", props.className);

  const status = () => {
    switch (props.status) {
      case CacheStatus.Ok:
        return IndicatorState.Positive;
      case CacheStatus.Missing:
        return IndicatorState.Negative;
      case CacheStatus.OutOfDate:
        return IndicatorState.Intermediate;
      default:
        return IndicatorState.Intermediate;
    }
  }

  const refreshCache = () => {
    if (props.refreshCache) props.refreshCache(props.cache_name || "");
  }

  const invalidateCache = () => {
    if (props.invalidateCache) props.invalidateCache(props.cache_name || "");
  }

  const deleteCache = () => {
    if (props.deleteCache) props.deleteCache(props.cache_name || "");
  }

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.default }}>
      <StatusIndicator state={status()}>
        {props.cache_name?.replace("Cache_", "").replace("_1", "") || ""}
        <div>
          {(props.refreshCache)? (<Button onClick={() => refreshCache()}>[Refresh]</Button>) : <Button disabled>[Refresh]</Button>}
          {(props.invalidateCache && props.status !== CacheStatus.OutOfDate)? (<Button onClick={() => invalidateCache()}>[Invalidate]</Button>) : <Button disabled>[Invalidate]</Button>}
          {(props.deleteCache)? (<Button onClick={() => deleteCache()}>[Delete]</Button>) : <Button disabled>[Delete]</Button>}
        </div>
      </StatusIndicator>
    </div>
  )
}

export default Cache;
