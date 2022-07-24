import { useEffect, useState } from "react";
import useClassNames from "Hooks/useClassNames";
import { Button, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import PageContainer from "Components/Containers/PageContainer/PageContainer";
import TextCombo, { TextComboChangeEvent } from "Components/Input/TextCombo/TextCombo";

import type Friend from "DataTypes/Friend";
import type { Page } from "DataTypes/Components";
import type { ContextMenuItemProps } from "Components/Menus/ContextMenuItem/ContextMenuItem";

interface BlockedUsersPageProps extends Page {
  friends?: Friend[],
  onReloadList?: () => void,
  onUnblockFriend?: (uuid: string) => void
}

function BlockedUsersPage(props: BlockedUsersPageProps) {
  const Localizations_BlockedUsersPage = useTranslation("BlockedUsersPage").t;
  const classNames = useClassNames("BlockedUsersPageContainer", props.className);

  const [UnblockFriendDialogSelector, setUnblockFriendDialogSelector] = useState("");

  useEffect(() => {
    if (props.sharedProps && props.sharedProps.changeTitleCallback) props.sharedProps.changeTitleCallback(Localizations_BlockedUsersPage("PageTitle"));
  }, [Localizations_BlockedUsersPage, props, props.sharedProps?.changeTitleCallback]);

  const blockedUserElements = (() => {
    if (props.friends) {
      return props.friends.map((friend) => {
        if (!friend.friendData) return null;

        const isBlocked = friend.status?.toLowerCase() === "blocked";

        if (isBlocked) {
          const friendContextMenuItems: ContextMenuItemProps[] = [
            { children: Localizations_BlockedUsersPage("ContextMenuItem-UnblockFriend"), onLeftClick: () => friend.friendData && friend.friendData.uuid ? setUnblockFriendDialogSelector(friend.friendData.uuid) : null },
          ];

          const friendRightClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
            if (props.sharedProps && props.sharedProps.ContextMenu && event.currentTarget) {
              props.sharedProps.ContextMenu.setAnchor({ x: event.clientX, y: event.clientY });
              props.sharedProps.ContextMenu.setItems(friendContextMenuItems);
              props.sharedProps.ContextMenu.setVisibility(true);
            }
            event.preventDefault();
          }

          return null; // TODO: Return friend entry
        }
        return null;
      });
    }
  })()

  const NoBlockedUsersHint = (() => {
    return (
      <div className="NoBlockedUsersHintContainer">
        <Typography variant="h6">{Localizations_BlockedUsersPage("Typography_Heading-NoBlockedUsersHint")}</Typography>
        <Typography variant="body1">{Localizations_BlockedUsersPage("Typography_Body-NoBlockedUsersHint")}</Typography>
      </div>
    )
  })()

  return (
    <PageContainer className={classNames} adaptive={false}>
      <Button onClick={() => { if (props.onReloadList) props.onReloadList() }}>{Localizations_BlockedUsersPage("Button_Label-ReloadFriendsList")}</Button>
      <div className="FriendsContainer">
        {blockedUserElements && blockedUserElements.length > 0 ? blockedUserElements : NoBlockedUsersHint}
      </div>
    </PageContainer>
  );
}

export default BlockedUsersPage;
