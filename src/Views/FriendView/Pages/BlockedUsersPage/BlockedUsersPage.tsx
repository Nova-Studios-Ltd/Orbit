import { useEffect, useState } from "react";
import useClassNames from "Hooks/useClassNames";
import { Button, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import AvatarTextButton from "Components/Buttons/AvatarTextButton/AvatarTextButton";
import ContextMenu from "Components/Menus/ContextMenu/ContextMenu";
import ContextMenuItem from "Components/Menus/ContextMenuItem/ContextMenuItem";
import PageContainer from "Components/Containers/PageContainer/PageContainer";
import GenericDialog from "Components/Dialogs/GenericDialog/GenericDialog";
import TextCombo, { TextComboChangeEvent } from "Components/Input/TextCombo/TextCombo";

import type Friend from "DataTypes/Friend";
import type { Page } from "DataTypes/Components";
import type { Coordinates } from "DataTypes/Types";

interface BlockedUsersPageProps extends Page {
  friends?: Friend[],
  onReloadList?: () => void,
  onUnblockFriend?: (uuid: string) => void
}

function BlockedUsersPage(props: BlockedUsersPageProps) {
  const Localizations_BlockedUsersPage = useTranslation("BlockedUsersPage").t;
  const Localizations_GenericDialog = useTranslation("GenericDialog").t;
  const classNames = useClassNames("BlockedUsersPageContainer", props.className);

  const [FriendContextMenuVisible, setFriendContextMenuVisibility] = useState(false);
  const [FriendContextMenuAnchorPos, setFriendContextMenuAnchorPos] = useState({} as unknown as Coordinates);
  const [FriendContextMenuSelectedFriend, setFriendContextMenuSelectedFriend] = useState(null as unknown as Friend);
  const [UnblockFriendDialogSelector, setUnblockFriendDialogSelector] = useState("");

  const unblockFriend = (uuid?: string) => {
    if (uuid && props.onUnblockFriend) props.onUnblockFriend(uuid);
    setUnblockFriendDialogSelector("");
  }

  useEffect(() => {
    if (props.sharedProps && props.sharedProps.changeTitleCallback) props.sharedProps.changeTitleCallback(Localizations_BlockedUsersPage("PageTitle"));
  }, [Localizations_BlockedUsersPage, props, props.sharedProps?.changeTitleCallback]);

  const blockedUserElements = (() => {
    if (props.friends) {
      return props.friends.map((friend) => {
        if (!friend.friendData) return null;

        const UnblockFriendDialogVisible = UnblockFriendDialogSelector === friend.friendData?.uuid;
        const isBlocked = friend.status?.toLowerCase() === "blocked";

        if (isBlocked) {

          const friendRightClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
            setFriendContextMenuAnchorPos({ x: event.clientX, y: event.clientY });
            setFriendContextMenuSelectedFriend(friend);
            setFriendContextMenuVisibility(true);
            event.preventDefault();
          }

          return (
            <div key={friend.friendData.uuid} className="FriendButtonContainer">
              <AvatarTextButton onRightClick={friendRightClickHandler} showEllipsis iconSrc={friend.friendData.avatar} sharedProps={props.sharedProps}>
                <div className="FriendButtonContent">
                  <Typography>{friend.friendData?.username}#{friend.friendData?.discriminator}</Typography>
                  <Typography variant="caption">{Localizations_BlockedUsersPage("Typography-UserBlocked")}</Typography>
                </div>
              </AvatarTextButton>
              <GenericDialog open={UnblockFriendDialogVisible} onClose={() => setUnblockFriendDialogSelector("")} title={Localizations_BlockedUsersPage("Typography-UnblockFriendDialogTitle", { user: friend.friendData.username })} buttons={
                <>
                  <Button onClick={(event) => { setUnblockFriendDialogSelector(""); event.stopPropagation() }}>{Localizations_GenericDialog("Button_Label-DialogCancel")}</Button>
                  <Button color="error" onClick={(event) => { unblockFriend(); event.stopPropagation() }}>{Localizations_GenericDialog("Button_Label-DialogUnblock")}</Button>
                </>
              }>
              <div className="GenericDialogTextContainer">
                <Typography variant="body1">{Localizations_BlockedUsersPage("Typography-UnblockFriendDialogBlurb", { user: friend.friendData.username })}</Typography>
              </div>
              </GenericDialog>
            </div>
          );
        }
        return null;
      });
    }
    return null;
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
      <Button onClick={() => { if (props.onReloadList) props.onReloadList() }}>{Localizations_BlockedUsersPage("Button_Label-ReloadBlockedUsersList")}</Button>
      <div className="FriendsContainer">
        {blockedUserElements && blockedUserElements.length > 0 ? blockedUserElements : NoBlockedUsersHint}
      </div>
      <ContextMenu open={FriendContextMenuVisible} anchorPos={FriendContextMenuAnchorPos} onDismiss={() => setFriendContextMenuVisibility(false)}>
        <ContextMenuItem onLeftClick={() => FriendContextMenuSelectedFriend && FriendContextMenuSelectedFriend.friendData && FriendContextMenuSelectedFriend.friendData.uuid ? setUnblockFriendDialogSelector(FriendContextMenuSelectedFriend.friendData.uuid) : null}>{Localizations_BlockedUsersPage("ContextMenuItem-UnblockFriend")}</ContextMenuItem>
      </ContextMenu>
    </PageContainer>
  );
}

export default BlockedUsersPage;
