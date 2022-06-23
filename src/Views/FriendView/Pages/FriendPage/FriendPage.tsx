import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dictionary } from "NSLib/Dictionary";
import { Button, Typography } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import PageContainer from "Components/Containers/PageContainer/PageContainer";
import AvatarTextButton from "Components/Buttons/AvatarTextButton/AvatarTextButton";

import type { Page } from "DataTypes/Components";
import type Friend from "DataTypes/Friend";
import type { ContextMenuItemProps } from "Components/Menus/ContextMenuItem/ContextMenuItem";
import GenericDialog from "Components/Dialogs/GenericDialog/GenericDialog";

interface FriendPageProps extends Page {
  friends?: Friend[],
  onReloadList?: () => void,
  onFriendClicked?: (friend: Friend) => void,
  onAddFriend?: (recipient: string) => void,
  onRemoveFriend?: (uuid: string) => void,
  onBlockFriend?: (uuid: string) => void,
  onUnblockFriend?: (uuid: string) => void
}

function FriendPage(props: FriendPageProps) {
  const Localizations_FriendView = useTranslation("FriendView").t;
  const Localizations_FriendPage = useTranslation("FriendListPage").t;
  const Localizations_GenericDialog = useTranslation("GenericDialog").t;
  const classNames = useClassNames("FriendPageContainer", props.className);

  const [RemoveFriendDialogSelector, setRemoveFriendDialogSelector] = useState("");
  const [BlockUnblockFriendDialogSelector, setBlockUnblockFriendDialogSelector] = useState("");

  const removeFriend = (uuid?: string) => {
    if (uuid && props.onRemoveFriend) props.onRemoveFriend(uuid);
    setRemoveFriendDialogSelector("");
  }

  const blockFriend = (uuid?: string) => {
    if (uuid && props.onBlockFriend) props.onBlockFriend(uuid);
    setBlockUnblockFriendDialogSelector("");
  }

  const unblockFriend = (uuid?: string) => {
    if (uuid && props.onUnblockFriend) props.onUnblockFriend(uuid);
    setBlockUnblockFriendDialogSelector("");
  }

  const friendElements = (() => {
    if (props.friends) {
      return props.friends.map((friend) => {
        if (!friend.friendData) return null;

        const RemoveFriendDialogVisible = RemoveFriendDialogSelector === friend.friendData?.uuid;
        const BlockUnblockFriendDialogVisible = BlockUnblockFriendDialogSelector === friend.friendData?.uuid;
        const isBlocked = friend.status?.toLowerCase() === "blocked";

        const friendContextMenuItems: ContextMenuItemProps[] = [
          { children: Localizations_FriendPage("ContextMenuItem-RemoveFriend"), onLeftClick: () => friend.friendData && friend.friendData.uuid ? setRemoveFriendDialogSelector(friend.friendData.uuid) : null},
          { children: isBlocked ? Localizations_FriendPage("ContextMenuItem-UnblockFriend") : Localizations_FriendPage("ContextMenuItem-BlockFriend"), onLeftClick: () => friend.friendData && friend.friendData.uuid ? setBlockUnblockFriendDialogSelector(friend.friendData.uuid) : null },
        ];

        const friendRightClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
          if (props.sharedProps && props.sharedProps.ContextMenu && event.currentTarget) {
            props.sharedProps.ContextMenu.setAnchor({ x: event.clientX, y: event.clientY });
            props.sharedProps.ContextMenu.setItems(friendContextMenuItems);
            props.sharedProps.ContextMenu.setVisibility(true);
          }
          event.preventDefault();
        }

        // TODO: Localize friend.status
        return (
        <AvatarTextButton key={friend.friendData.uuid} className="FriendButton" showEllipsisConditional iconSrc={friend.friendData.avatar} onLeftClick={() => { if (props.onFriendClicked) props.onFriendClicked(friend) }} onRightClick={friendRightClickHandler} sharedProps={props.sharedProps}>
          <div className="FriendButtonContainer">
            <Typography>{friend.friendData?.username}#{friend.friendData?.discriminator}</Typography>
            <Typography variant="caption">{friend.status}</Typography>
          </div>
          <GenericDialog onClose={() => setRemoveFriendDialogSelector("")} open={RemoveFriendDialogVisible} title={Localizations_FriendPage("Typography-RemoveFriendDialogTitle", { user: friend.friendData.username })} buttons={
            <>
              <Button onClick={(event) => { setRemoveFriendDialogSelector(""); event.stopPropagation(); }}>{Localizations_GenericDialog("Button_Label-DialogCancel")}</Button>
              <Button color="error" onClick={(event) => { removeFriend(friend.friendData?.uuid); event.stopPropagation() }}>{Localizations_GenericDialog("Button_Label-DialogRemove")}</Button>
            </>
          }>
            <div className="GenericDialogTextContainer">
              <Typography variant="body1">{Localizations_FriendPage("Typography-RemoveFriendDialogBlurb", { user: friend.friendData.username })}</Typography>
            </div>
          </GenericDialog>
          <GenericDialog onClose={() => setBlockUnblockFriendDialogSelector("")} open={BlockUnblockFriendDialogVisible} title={isBlocked ? Localizations_FriendPage("Typography-UnblockFriendDialogTitle", { user: friend.friendData.username }) : Localizations_FriendPage("Typography-BlockFriendDialogTitle", { user: friend.friendData.username })} buttons={
            <>
              <Button onClick={(event) => { setBlockUnblockFriendDialogSelector(""); event.stopPropagation() }}>{Localizations_GenericDialog("Button_Label-DialogCancel")}</Button>
              <Button color="error" onClick={(event) => { isBlocked ? unblockFriend(friend.friendData?.uuid) : blockFriend(friend.friendData?.uuid); event.stopPropagation() }}>{isBlocked ? Localizations_GenericDialog("Button_Label-DialogUnblock") : Localizations_GenericDialog("Button_Label-DialogBlock")}</Button>
            </>
          }>
            <div className="GenericDialogTextContainer">
              <Typography variant="body1">{Localizations_FriendPage(isBlocked ? "Typography-UnblockFriendDialogBlurb" : "Typography-BlockFriendDialogBlurb", { user: friend.friendData.username })}</Typography>
            </div>
          </GenericDialog>
        </AvatarTextButton>)
      });
    }
  })()

  const NoFriendsHint = (() => {
    return (
      <div className="NoChannelsHintContainer">
      <Typography variant="h6">{Localizations_FriendPage("Typography_Heading-NoFriendHint")}</Typography>
      <Typography variant="body1">{Localizations_FriendPage("Typography_Body-NoFriendHint", { AddFriendSectionTitle: Localizations_FriendView("Tab_Label-AddFriend") })}</Typography>
    </div>
    )
  })()

  useEffect(() => {
    if (props.sharedProps && props.sharedProps.changeTitleCallback) props.sharedProps.changeTitleCallback(Localizations_FriendPage("PageTitle"));
  }, [Localizations_FriendPage, props, props.sharedProps?.changeTitleCallback]);

  return (
    <PageContainer className={classNames} adaptive={false}>
      <Button onClick={() => { if (props.onReloadList) props.onReloadList() }}>{Localizations_FriendPage("Button_Label-ReloadFriendsList")}</Button>
      <div className="FriendsContainer">
        {friendElements && friendElements.length > 0 ? friendElements : NoFriendsHint}
      </div>
    </PageContainer>
  );
}

export default FriendPage;
