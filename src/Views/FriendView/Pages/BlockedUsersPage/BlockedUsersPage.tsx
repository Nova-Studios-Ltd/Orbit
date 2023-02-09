import { useEffect } from "react";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import { useDispatch, useSelector } from "Redux/Hooks";
import { selectBlockedFriends } from "Redux/Selectors/FriendSelectors";
import { FriendsPopulate, FriendUnblock } from "Redux/Thunks/Friends";

import PageContainer from "Components/Containers/PageContainer/PageContainer";
import FriendList from "Components/Friends/FriendList/FriendList";

import type Friend from "Types/UI/Friend";
import type { Page } from "Types/UI/Components";
import { FriendButtonVariant } from "Types/Enums";

interface BlockedUsersPageProps extends Page {

}

function BlockedUsersPage(props: BlockedUsersPageProps) {
  const Localizations_BlockedUsersPage = useTranslation("BlockedUsersPage").t;
  const classNames = useClassNames("BlockedUsersPageContainer", props.className);
  const dispatch = useDispatch();

  const friends = useSelector(selectBlockedFriends());

  return (
    <PageContainer className={classNames} adaptive={false}>
      <FriendList friends={friends} emptyPlaceholderHeader={Localizations_BlockedUsersPage("Typography_Heading-NoBlockedUsersHint")} emptyPlaceholderBody={Localizations_BlockedUsersPage("Typography_Body-NoBlockedUsersHint")} onReloadList={() => dispatch(FriendsPopulate())} onUnblockFriend={FriendUnblock} />
    </PageContainer>
  );
}

export default BlockedUsersPage;
