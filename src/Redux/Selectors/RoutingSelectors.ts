import type { AppSelector } from "Redux/Store";
import type { Param } from "Types/UI/Routing";

export function selectLocation(): AppSelector<string> {
  return (state) => {
    const routing = state.routing;

    return routing.pathname + selectParamConstruct()(state);
  }
}

export function selectPathname(): AppSelector<string> {
  return (state) => {
    const routing = state.routing;

    return routing.pathname;
  }
}

export function selectParamConstruct(): AppSelector<string> {
  return (state) => {
    const params = state.routing.params;
    let paramStr = "";

    for (let i = 0; i < params.length; i++) {
      const param = params[i];

      if (param.key && param.key.length > 0) {
        paramStr += `${i === 0 ? "?" : "&"}${param.key}${param.value && param.value.length > 0 ? `=${param.value}` : ""}`;
      }
    }

    return paramStr;
  }
}

export function selectParamByKey(key: string): AppSelector<Param | undefined> {
  return (state) => {
    return state.routing.params.find(param => param.key === key);
  }
}

export function selectParamByKeyExists(key: string): AppSelector<boolean> {
  return (state) => {
    return selectParamByKey(key)(state) !== undefined;
  }
}
