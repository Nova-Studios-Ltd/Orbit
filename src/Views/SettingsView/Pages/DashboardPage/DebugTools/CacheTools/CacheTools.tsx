import { Button, FormControlLabel, Switch, useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "Types/UI/Components";
import { SettingsManager } from "NSLib/SettingsManager";
import { useState } from "react";
import Cache, { CacheStatus } from "./Cache";
import { GetCaches, CacheIsUptoDate, CacheValid, DeleteCache, InvalidateCache, RefreshCache } from "./CacheLib";

export interface ComponentProps extends NCComponent {

}

function CacheTools(props: ComponentProps) {
  const theme = useTheme();
  const classNames = useClassNames("ComponentContainer", props.className);
  const [caches, setCaches] = useState([[CacheStatus.Missing, ""]]);

  const getCaches = async () => {
    const rawCaches = await GetCaches();
    const cc = [];
    for (let c = 0; c < rawCaches.length; c++) {
      const cache = rawCaches[c].replace("Cache_", "").replace("_1", "");
      const d = await testCache(cache);
      cc.push([d, cache]);
    }

    setCaches(cc);
  }

  const testCache = async (cache: string) => {
    let cacheStatus = CacheStatus.Ok;
    if (!await CacheValid(cache)) cacheStatus = CacheStatus.Missing;
    if (!await CacheIsUptoDate(cache)) cacheStatus = CacheStatus.OutOfDate;
    return cacheStatus;
  }

  const deleteCache = (cache: string) => {
    DeleteCache(cache);
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  }

  const invalidateCache = (cache: string) => {
    InvalidateCache(cache);
    getCaches();
  }

  const refreshCache = (cache: string) => {
    RefreshCache(cache);
    getCaches();
  }

  const map = () => {
    const cs = [] as JSX.Element[];
    for (let c = 0; c < caches.length; c++) {
      const cache = caches[c] as [CacheStatus, string];
      if (cache[1].length === 0) continue;
      cs.push((<div key={cache[1]}><Cache cache_name={cache[1]} status={cache[0]} deleteCache={deleteCache} invalidateCache={invalidateCache} refreshCache={refreshCache}></Cache><br/></div>));
    }
    return cs;
  }

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.default }}>
      <Button onClick={getCaches}>[Check Cache]</Button>
      {map()}
    </div>
  )
}

export default CacheTools;
