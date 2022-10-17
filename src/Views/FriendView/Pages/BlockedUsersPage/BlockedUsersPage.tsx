import { useEffect, useState } from "react";
import useClassNames from "Hooks/useClassNames";
import { Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { WriteToClipboard } from "NSLib/ElectronAPI";

import AvatarTextButton from "Components/Buttons/AvatarTextButton/AvatarTextButton";
import ContextMenu from "Components/Menus/ContextMenu/ContextMenu";
import ContextMenuItem from "Components/Menus/ContextMenuItem/ContextMenuItem";
import PageContainer from "Components/Containers/PageContainer/PageContainer";
import GenericDialog from "Components/Dialogs/GenericDialog/GenericDialog";

import type Friend from "Types/UI/Friend";
import type { Page } from "Types/UI/Components";
import type { Coordinates } from "Types/General";

interface BlockedUsersPageProps extends Page {
  friends?: Friend[],
  onReloadList?: () => void,
  onUnblockFriend?: (uuid: string) => void
}

function BlockedUsersPage(props: BlockedUsersPageProps) {
  const Localizations_BlockedUsersPage = useTranslation("BlockedUsersPage").t;
  const Localizations_GenericDialog = useTranslation("GenericDialog").t;
  const Localizations_ContextMenuItem = useTranslation("ContextMenuItem").t;
  const classNames = useClassNames("BlockedUsersPageContainer", props.className);

  const [FriendContextMenuVisible, setFriendContextMenuVisibility] = useState(false);
  const [FriendContextMenuAnchorPos, setFriendContextMenuAnchorPos] = useState({} as unknown as Coordinates);
  const [FriendContextMenuSelectedFriend, setFriendContextMenuSelectedFriend] = useState(null as unknown as Friend);
  const [UnblockFriendDialogSelector, setUnblockFriendDialogSelector] = useState("");

  useEffect(() => {
    if (props.sharedProps && props.sharedProps.changeTitleCallback) props.sharedProps.changeTitleCallback(Localizations_BlockedUsersPage("PageTitle"));
  })

  const unblockFriend = (uuid?: string) => {
    if (uuid && props.onUnblockFriend) props.onUnblockFriend(uuid);
    setUnblockFriendDialogSelector("");
  }

  const blockedUserElements = (() => {
    if (props.friends) {
      let containsBlockedUsers = false;
      const elements = props.friends.map((friend) => {
        if (!friend.friendData) return null;

        const UnblockFriendDialogVisible = UnblockFriendDialogSelector === friend.friendData?.uuid;
        const isBlocked = friend.status?.toLowerCase() === "blocked";

        if (isBlocked) {

          containsBlockedUsers = true;

          const friendRightClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
            setFriendContextMenuAnchorPos({ x: event.clientX, y: event.clientY });
            setFriendContextMenuSelectedFriend(friend);
            setFriendContextMenuVisibility(true);
            event.preventDefault();
          }

          return (
            <div key={friend.friendData.uuid} className="FriendButtonContainer">
              <AvatarTextButton onRightClick={friendRightClickHandler} showEllipsis fullWidth iconSrc={friend.friendData.avatar}>
                <div className="FriendButtonContent">
                  <Typography>{friend.friendData?.username}#{friend.friendData?.discriminator}</Typography>
                  <Typography variant="caption" color="gray">{friend.friendData?.uuid}</Typography>
                  <Typography variant="caption">{Localizations_BlockedUsersPage("Typography-UserBlocked")}</Typography>
                </div>
              </AvatarTextButton>
              <GenericDialog sharedProps={props.sharedProps}open={UnblockFriendDialogVisible} onClose={() => setUnblockFriendDialogSelector("")} title={Localizations_BlockedUsersPage("Typography-UnblockFriendDialogTitle", { user: friend.friendData.username })} buttons={
                <>
                  <Button onClick={(event) => { setUnblockFriendDialogSelector(""); event.stopPropagation() }}>{Localizations_GenericDialog("Button_Label-DialogCancel")}</Button>
                  <Button color="error" onClick={(event) => { unblockFriend(friend.friendData?.uuid); event.stopPropagation() }}>{Localizations_GenericDialog("Button_Label-DialogUnblock")}</Button>
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
      if (!containsBlockedUsers) return null;
      return elements;
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
      <Button variant="outlined" style={{ marginLeft: "auto" }} onClick={() => { if (props.onReloadList) props.onReloadList() }}>{Localizations_BlockedUsersPage("Button_Label-ReloadBlockedUsersList")}</Button>
      <div className="FriendsContainer">
        {blockedUserElements && blockedUserElements.length > 0 ? blockedUserElements : NoBlockedUsersHint}
      </div>
      <ContextMenu open={FriendContextMenuVisible} anchorPos={FriendContextMenuAnchorPos} onDismiss={() => setFriendContextMenuVisibility(false)}>
        <ContextMenuItem onLeftClick={() => FriendContextMenuSelectedFriend && FriendContextMenuSelectedFriend.friendData && FriendContextMenuSelectedFriend.friendData.username && FriendContextMenuSelectedFriend.friendData.discriminator ? WriteToClipboard(`${FriendContextMenuSelectedFriend.friendData.username}#${FriendContextMenuSelectedFriend.friendData.discriminator}`) : null}>{Localizations_ContextMenuItem("ContextMenuItem-CopyUser")}</ContextMenuItem>
        <ContextMenuItem onLeftClick={() => FriendContextMenuSelectedFriend && FriendContextMenuSelectedFriend.friendData && FriendContextMenuSelectedFriend.friendData.uuid ? WriteToClipboard(FriendContextMenuSelectedFriend.friendData.uuid) : null}>{Localizations_ContextMenuItem("ContextMenuItem-CopyUUID")}</ContextMenuItem>
        <ContextMenuItem onLeftClick={() => FriendContextMenuSelectedFriend && FriendContextMenuSelectedFriend.friendData && FriendContextMenuSelectedFriend.friendData.uuid ? setUnblockFriendDialogSelector(FriendContextMenuSelectedFriend.friendData.uuid) : null}>{Localizations_ContextMenuItem("ContextMenuItem-Unblock")}</ContextMenuItem>
      </ContextMenu>
    </PageContainer>
  );
}

export default BlockedUsersPage;
