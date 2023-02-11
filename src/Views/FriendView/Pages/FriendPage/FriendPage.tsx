import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import useClassNames from "Hooks/useClassNames";

import { useDispatch, useSelector } from "Redux/Hooks";
import { selectAllFriends } from "Redux/Selectors/FriendSelectors";
import { FriendBlock, FriendClicked, FriendCreateGroup, FriendRemove, FriendsPopulate, FriendUnblock } from "Redux/Thunks/Friends";
import { removeParam } from "Redux/Slices/RouteSlice";
import { selectParamByKeyExists } from "Redux/Selectors/RoutingSelectors";

import PageContainer from "Components/Containers/PageContainer/PageContainer";
import FriendList from "Components/Friends/FriendList/FriendList";

import type { Page } from "Types/UI/Components";
import type Friend from "Types/UI/Friend";
import { Params } from "Types/UI/Routing";
import { FriendButtonVariant } from "Types/Enums";

interface FriendPageProps extends Page {

}

function FriendPage(props: FriendPageProps) {
  const Localizations_FriendView = useTranslation("FriendView").t;
  const Localizations_FriendPage = useTranslation("FriendListPage").t;
  const classNames = useClassNames("FriendPageContainer", props.className);
  const dispatch = useDispatch();

  const inSelectionMode = useSelector(selectParamByKeyExists(Params.CreateGroup));
  const friends = useSelector(selectAllFriends());

  const exitCreateGroupChannelMode = () => {
    dispatch(removeParam(Params.CreateGroup));
  }

  const onCreateGroup = (recipients?: Friend[]) => {
    if (recipients !== undefined && recipients.length > 0) {
      FriendCreateGroup(recipients);
    }
    exitCreateGroupChannelMode();
  }

  return (
    <PageContainer className={classNames} adaptive={false}>
      <FriendList friends={friends} variant={FriendButtonVariant.FriendsOnly} inSelectionMode={inSelectionMode} emptyPlaceholderHeader={Localizations_FriendPage("Typography_Heading-NoFriendHint")} emptyPlaceholderBody={Localizations_FriendPage("Typography_Body-NoFriendHint", { AddFriendSectionTitle: Localizations_FriendView("Tab_Label-AddFriend") })} onCreateGroup={onCreateGroup} onFriendClicked={(friend) => dispatch(FriendClicked(friend))} onReloadList={() => dispatch(FriendsPopulate())} onRemoveFriend={FriendRemove} onBlockFriend={FriendBlock} onUnblockFriend={FriendUnblock} />
    </PageContainer>
  );
}

export default FriendPage;
