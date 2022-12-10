import { useEffect } from "react";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import PageContainer from "Components/Containers/PageContainer/PageContainer";
import FriendList from "Components/Friends/FriendList/FriendList";

import type Friend from "Types/UI/Friend";
import type { Page } from "Types/UI/Components";
import { FriendButtonVariant } from "Types/Enums";

interface BlockedUsersPageProps extends Page {
  friends?: Friend[],
  onReloadList?: () => void,
  onUnblockFriend?: (uuid: string) => void
}

function BlockedUsersPage(props: BlockedUsersPageProps) {
  const Localizations_BlockedUsersPage = useTranslation("BlockedUsersPage").t;
  const classNames = useClassNames("BlockedUsersPageContainer", props.className);

  useEffect(() => {
    if (props.sharedProps && props.sharedProps.changeTitleCallback) props.sharedProps.changeTitleCallback(Localizations_BlockedUsersPage("PageTitle"));
  })

  return (
    <PageContainer className={classNames} adaptive={false}>
      <FriendList sharedProps={props.sharedProps} friends={props.friends} variant={FriendButtonVariant.Blocked} emptyPlaceholderHeader={Localizations_BlockedUsersPage("Typography_Heading-NoBlockedUsersHint")} emptyPlaceholderBody={Localizations_BlockedUsersPage("Typography_Body-NoBlockedUsersHint")} onReloadList={props.onReloadList} onUnblockFriend={props.onUnblockFriend} />
    </PageContainer>
  );
}

export default BlockedUsersPage;
