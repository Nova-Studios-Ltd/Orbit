import { useDispatch } from "Redux/Hooks";
import { HistoryEntry, Param } from "Types/UI/Routing";

import type { NCComponent } from "Types/UI/Components";
import { navigate } from "Redux/Thunks/Routing";

export interface RedirectProps extends NCComponent {
  to: HistoryEntry,
  params?: Param[]
}

function Redirect(props: RedirectProps) {
  const dispatch = useDispatch();

  dispatch(navigate(props.to));

  // This component is not supposed to render anything.
  return null;
}

export default Redirect;
