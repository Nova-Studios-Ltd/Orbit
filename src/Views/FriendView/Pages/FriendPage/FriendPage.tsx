import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useClassNames from "Hooks/useClassNames";

import PageContainer from "Components/Containers/PageContainer/PageContainer";
import FriendList from "Components/Friends/FriendList/FriendList";

import type { Page } from "Types/UI/Components";
import type Friend from "Types/UI/Friend";
import { Routes } from "Types/UI/Routes";

interface FriendPageProps extends Page {
  friends?: Friend[],
  onReloadList?: () => void,
  onFriendClicked?: (friend: Friend) => void,
  onCreateGroup?: (recipients: Friend[]) => void,
  onRemoveFriend?: (uuid: string) => void,
  onBlockFriend?: (uuid: string) => void,
  onUnblockFriend?: (uuid: string) => void
}

function FriendPage(props: FriendPageProps) {
  const Localizations_FriendView = useTranslation("FriendView").t;
  const Localizations_FriendPage = useTranslation("FriendListPage").t;
  const Localizations_Button = useTranslation("Button").t;
  const Localizations_ContextMenuItem = useTranslation("ContextMenuItem").t;
  const Localizations_GenericDialog = useTranslation("GenericDialog").t;
  const classNames = useClassNames("FriendPageContainer", props.className);
  const location = useLocation();
  const navigate = useNavigate();

  const createGroupChannelMode = (() => {
    const params = location.search.split("&");

    for (let i = 0; i < params.length; i++) {
      const desiredRoute = String(Routes.AddFriendGroup).split("?");
      const param = params[i].toLowerCase();
      if (param.match(desiredRoute[desiredRoute.length - 1])) {
        return true;
      }
    }

    return false;

  })()

  const exitCreateGroupChannelMode = () => {
    navigate(Routes.FriendsList);
  }

  const onCreateGroup = (recipients?: Friend[]) => {
    if (props.onCreateGroup && recipients !== undefined && recipients.length > 0) {
      props.onCreateGroup(recipients);
    }
    exitCreateGroupChannelMode();
  }

  useEffect(() => {
    if (props.sharedProps && props.sharedProps.changeTitleCallback) props.sharedProps.changeTitleCallback(Localizations_FriendPage("PageTitle"));
  })

  return (
    <PageContainer className={classNames} adaptive={false}>
      <FriendList sharedProps={props.sharedProps} friends={props.friends} inSelectionMode={createGroupChannelMode} emptyPlaceholderHeader={Localizations_FriendPage("Typography_Heading-NoFriendHint")} emptyPlaceholderBody={Localizations_FriendPage("Typography_Body-NoFriendHint", { AddFriendSectionTitle: Localizations_FriendView("Tab_Label-AddFriend") })} onCreateGroup={onCreateGroup} onFriendClicked={props.onFriendClicked} onReloadList={props.onReloadList} onRemoveFriend={props.onRemoveFriend} onBlockFriend={props.onBlockFriend} onUnblockFriend={props.onUnblockFriend} />
    </PageContainer>
  );
}

export default FriendPage;
