import { closeChannelMenu } from "Redux/Slices/AppSlice";
import { go, back, addParam, removeParam } from "Redux/Slices/RouteSlice";
import { AppThunk } from "Redux/Store";

import { HistoryEntry, SpecialRoutes } from "Types/UI/Routing";

export function navigate(to: HistoryEntry): AppThunk<void> {
  return (dispatch, getState) => {
    const state = getState();

    if (state.app.widthConstrained) dispatch(closeChannelMenu());

    if (to.params) {
      for (let i = 0; i < to.params.length; i++) {
        const param = to.params[i];
        dispatch(addParam(param.key, param.value, param.unsetOnNavigate));
      }
    }

    for (let i = 0; i < state.routing.params.length; i++) {
      const param = state.routing.params[i];
      if (param.unsetOnNavigate) dispatch(removeParam(param.key));
    }

    if (to.pathname === SpecialRoutes.Back) {
      dispatch(back());
      return;
    }

    if (to.pathname === SpecialRoutes.Forward) {
      //dispatch(forward); // FIXME not implemented
      return;
    }

    dispatch(go(to.pathname, to.title));
  }
}
