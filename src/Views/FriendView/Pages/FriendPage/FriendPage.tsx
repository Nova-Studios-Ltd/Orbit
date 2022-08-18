import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dictionary } from "NSLib/Dictionary";
import { Button, Typography } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import PageContainer from "Components/Containers/PageContainer/PageContainer";
import AvatarTextButton from "Components/Buttons/AvatarTextButton/AvatarTextButton";
import GenericDialog from "Components/Dialogs/GenericDialog/GenericDialog";
import ContextMenu from "Components/Menus/ContextMenu/ContextMenu";
import ContextMenuItem from "Components/Menus/ContextMenuItem/ContextMenuItem";

import type { Page } from "DataTypes/Components";
import type Friend from "DataTypes/Friend";
import type { Coordinates } from "DataTypes/Types";

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

  const [FriendContextMenuVisible, setFriendContextMenuVisibility] = useState(false);
  const [FriendContextMenuAnchorPos, setFriendContextMenuAnchorPos] = useState({} as unknown as Coordinates);
  const [FriendContextMenuSelectedFriend, setFriendContextMenuSelectedFriend] = useState(null as unknown as Friend);
  const [RemoveFriendDialogSelector, setRemoveFriendDialogSelector] = useState("");
  const [BlockUnblockFriendDialogSelector, setBlockFriendDialogSelector] = useState("");

  const removeFriend = (uuid?: string) => {
    if (uuid && props.onRemoveFriend) props.onRemoveFriend(uuid);
    setRemoveFriendDialogSelector("");
  }

  const blockFriend = (uuid?: string) => {
    if (uuid && props.onBlockFriend) props.onBlockFriend(uuid);
    setBlockFriendDialogSelector("");
  }

  const friendElements = (() => {
    if (props.friends) {
      return props.friends.map((friend) => {
        if (!friend.friendData) return null;

        const RemoveFriendDialogVisible = RemoveFriendDialogSelector === friend.friendData?.uuid;
        const BlockUnblockFriendDialogVisible = BlockUnblockFriendDialogSelector === friend.friendData?.uuid;
        const isBlocked = friend.status?.toLowerCase() === "blocked";

        if (isBlocked) return null;

        const friendRightClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
          setFriendContextMenuAnchorPos({ x: event.clientX, y: event.clientY });
          setFriendContextMenuSelectedFriend(friend);
          setFriendContextMenuVisibility(true);
        }

        // TODO: Localize friend.status
        return (
          <div key={friend.friendData.uuid} className="FriendButtonContainer">
            <AvatarTextButton className="FriendButton" showEllipsis iconSrc={friend.friendData.avatar} onLeftClick={() => { if (props.onFriendClicked) props.onFriendClicked(friend) }} onRightClick={friendRightClickHandler} sharedProps={props.sharedProps}>
              <div className="FriendButtonContent">
                <Typography>{friend.friendData?.username}#{friend.friendData?.discriminator}</Typography>
                <Typography variant="caption">{friend.status}</Typography>
              </div>
            </AvatarTextButton>
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
            <GenericDialog onClose={() => setBlockFriendDialogSelector("")} open={BlockUnblockFriendDialogVisible} title={Localizations_FriendPage("Typography-BlockFriendDialogTitle", { user: friend.friendData.username })} buttons={
              <>
                <Button onClick={(event) => { setBlockFriendDialogSelector(""); event.stopPropagation() }}>{Localizations_GenericDialog("Button_Label-DialogCancel")}</Button>
                <Button color="error" onClick={(event) => { blockFriend(friend.friendData?.uuid); event.stopPropagation() }}>{Localizations_GenericDialog("Button_Label-DialogBlock")}</Button>
              </>
            }>
              <div className="GenericDialogTextContainer">
                <Typography variant="body1">{Localizations_FriendPage(isBlocked ? "Typography-UnblockFriendDialogBlurb" : "Typography-BlockFriendDialogBlurb", { user: friend.friendData.username })}</Typography>
              </div>
            </GenericDialog>
          </div>
        )
      });
    }
  })()

  const NoFriendsHint = (() => {
    return (
      <div className="NoFriendsHintContainer">
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
      <ContextMenu open={FriendContextMenuVisible} anchorPos={FriendContextMenuAnchorPos} onDismiss={() => setFriendContextMenuVisibility(false)}>
        <ContextMenuItem onLeftClick={() => FriendContextMenuSelectedFriend && FriendContextMenuSelectedFriend.friendData && FriendContextMenuSelectedFriend.friendData.uuid ? setRemoveFriendDialogSelector(FriendContextMenuSelectedFriend.friendData.uuid) : null}>{Localizations_FriendPage("ContextMenuItem-RemoveFriend")}</ContextMenuItem>
        <ContextMenuItem onLeftClick={() => FriendContextMenuSelectedFriend && FriendContextMenuSelectedFriend.friendData && FriendContextMenuSelectedFriend.friendData.uuid ? setBlockFriendDialogSelector(FriendContextMenuSelectedFriend.friendData.uuid) : null}>{FriendContextMenuSelectedFriend && FriendContextMenuSelectedFriend.status && FriendContextMenuSelectedFriend.status?.toLowerCase() === "blocked" ? Localizations_FriendPage("ContextMenuItem-UnblockFriend") : Localizations_FriendPage("ContextMenuItem-BlockFriend")}</ContextMenuItem>
      </ContextMenu>
    </PageContainer>
  );
}

export default FriendPage;
