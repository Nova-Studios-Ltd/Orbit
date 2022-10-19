import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import type { NCComponent } from "Types/UI/Components";
import type Friend from "Types/UI/Friend";

export interface FriendListProps extends NCComponent {
  friends?: Friend[]
}

function FriendList(props: FriendListProps) {
  const theme = useTheme();
  const classNames = useClassNames("FriendListContainer", props.className);
  const Localizations_FriendList = useTranslation("FriendList").t;

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper }}>

    </div>
  );
}

export default FriendList;
