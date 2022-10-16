import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Checkbox, Typography } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { WriteToClipboard } from "NSLib/ElectronAPI";

import PageContainer from "Components/Containers/PageContainer/PageContainer";
import AvatarTextButton from "Components/Buttons/AvatarTextButton/AvatarTextButton";
import GenericDialog from "Components/Dialogs/GenericDialog/GenericDialog";
import ContextMenu from "Components/Menus/ContextMenu/ContextMenu";
import ContextMenuItem from "Components/Menus/ContextMenuItem/ContextMenuItem";

import type { Page } from "Types/UI/Components";
import type Friend from "Types/UI/Friend";
import type { Coordinates } from "Types/General";
import { SelectionType } from "Types/Enums";
import { Routes } from "Types/UI/Routes";

interface FriendPageProps extends Page {
  friends?: Friend[],
  onReloadList?: () => void,
  onFriendClicked?: (friend: Friend) => void,
  onCreateGroup?: (friends: Friend[]) => void,
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

  const [FriendContextMenuVisible, setFriendContextMenuVisibility] = useState(false);
  const [FriendContextMenuAnchorPos, setFriendContextMenuAnchorPos] = useState({} as unknown as Coordinates);
  const [FriendContextMenuSelectedFriend, setFriendContextMenuSelectedFriend] = useState(null as unknown as Friend);
  const [GroupChannelRecipientsList, setGroupChannelRecipientsList] = useState([] as Friend[]);
  const [RemoveFriendDialogSelector, setRemoveFriendDialogSelector] = useState("");
  const [BlockUnblockFriendDialogSelector, setBlockFriendDialogSelector] = useState("");

  useEffect(() => {
    if (props.sharedProps && props.sharedProps.changeTitleCallback) props.sharedProps.changeTitleCallback(Localizations_FriendPage("PageTitle"));
  })

  const friendIsInRecipientsList = (friend: Friend) => {
    for (let i = 0; i < GroupChannelRecipientsList.length; i++) {
      const selectedFriend = GroupChannelRecipientsList[i];
      if (selectedFriend.friendData?.uuid === friend.friendData?.uuid) return true;
    }

    return false;
  }

  const acceptFriendRequest = (friend?: Friend) => {
    if (friend && props.onFriendClicked) props.onFriendClicked(friend);
  }

  const removeFriend = (uuid?: string) => {
    if (uuid && props.onRemoveFriend) props.onRemoveFriend(uuid);
    setRemoveFriendDialogSelector("");
  }

  const blockFriend = (uuid?: string) => {
    if (uuid && props.onBlockFriend) props.onBlockFriend(uuid);
    setBlockFriendDialogSelector("");
  }

  const friendTicked = (checked: boolean, friend: Friend) => {
    if (checked) {
      if (friendIsInRecipientsList(friend)) return;

      setGroupChannelRecipientsList([...GroupChannelRecipientsList, friend]);
      return;
    }

    const NewGroupChannelRecipientsList = [];

    for (let i = 0; i < GroupChannelRecipientsList.length; i++) {
      const selectedFriend = GroupChannelRecipientsList[i];
      if (selectedFriend.friendData?.uuid !== friend.friendData?.uuid) NewGroupChannelRecipientsList.push(selectedFriend);
    }

    setGroupChannelRecipientsList(NewGroupChannelRecipientsList);
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

        const handleLeftClick = () => {
          if (createGroupChannelMode) {
            friendTicked(!friendIsInRecipientsList(friend), friend);
            return;
          }

          acceptFriendRequest(friend)
        }

        // TODO: Localize friend.status
        return (
          <div key={friend.friendData.uuid} className="FriendButtonContainer">
            {createGroupChannelMode ? <div className="FriendButtonSelectorContainer">
              <Checkbox checked={friendIsInRecipientsList(friend)} onChange={(e) => friendTicked(e.target.checked, friend)} />
            </div> : null}
            <AvatarTextButton className="FriendButton" showEllipsis selected={friendIsInRecipientsList(friend)} selectionType={SelectionType.MultiSelect} iconSrc={friend.friendData.avatar} onLeftClick={() => handleLeftClick()} onRightClick={friendRightClickHandler}>
              <div className="FriendButtonContent">
                <Typography>{friend.friendData?.username}#{friend.friendData?.discriminator}</Typography>
                <Typography variant="caption" color="gray">{friend.friendData?.uuid}</Typography>
                <Typography variant="caption">{friend.status}</Typography>
              </div>
            </AvatarTextButton>
            <GenericDialog sharedProps={props.sharedProps}onClose={() => setRemoveFriendDialogSelector("")} open={RemoveFriendDialogVisible} title={Localizations_FriendPage("Typography-RemoveFriendDialogTitle", { user: friend.friendData.username })} buttons={
              <>
                <Button onClick={(event) => { setRemoveFriendDialogSelector(""); event.stopPropagation(); }}>{Localizations_GenericDialog("Button_Label-DialogCancel")}</Button>
                <Button color="error" onClick={(event) => { removeFriend(friend.friendData?.uuid); event.stopPropagation() }}>{Localizations_GenericDialog("Button_Label-DialogRemove")}</Button>
              </>
            }>
              <div className="GenericDialogTextContainer">
                <Typography variant="body1">{Localizations_FriendPage("Typography-RemoveFriendDialogBlurb", { user: friend.friendData.username })}</Typography>
              </div>
            </GenericDialog>
            <GenericDialog sharedProps={props.sharedProps}onClose={() => setBlockFriendDialogSelector("")} open={BlockUnblockFriendDialogVisible} title={Localizations_FriendPage("Typography-BlockFriendDialogTitle", { user: friend.friendData.username })} buttons={
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

  return (
    <PageContainer className={classNames} adaptive={false}>
      <div className="FriendsPageButtonContainer">
        {createGroupChannelMode ? <Button disabled={GroupChannelRecipientsList.length < 1} variant="outlined" color="success" onClick={() => { if (props.onCreateGroup) props.onCreateGroup(GroupChannelRecipientsList) }}>{Localizations_FriendPage("Button_Label-CreateGroupChannel")}</Button> : null}
        {createGroupChannelMode ? <Button variant="outlined" color="error" onClick={() => { navigate(Routes.FriendsList); setGroupChannelRecipientsList([]); }}>{Localizations_Button("Button_Label-Cancel")}</Button> : null}
        <Button variant="outlined" style={{ marginLeft: "auto" }} onClick={() => { if (props.onReloadList) props.onReloadList() }}>{Localizations_FriendPage("Button_Label-ReloadFriendsList")}</Button>
      </div>
      <div className="FriendsContainer">
        {friendElements && friendElements.length > 0 ? friendElements : NoFriendsHint}
      </div>
      <ContextMenu open={FriendContextMenuVisible} anchorPos={FriendContextMenuAnchorPos} onDismiss={() => setFriendContextMenuVisibility(false)}>
        <ContextMenuItem onLeftClick={() => FriendContextMenuSelectedFriend && FriendContextMenuSelectedFriend.friendData && FriendContextMenuSelectedFriend.friendData.username && FriendContextMenuSelectedFriend.friendData.discriminator ? WriteToClipboard(`${FriendContextMenuSelectedFriend.friendData.username}#${FriendContextMenuSelectedFriend.friendData.discriminator}`) : null}>{Localizations_ContextMenuItem("ContextMenuItem-CopyUser")}</ContextMenuItem>
        <ContextMenuItem onLeftClick={() => FriendContextMenuSelectedFriend && FriendContextMenuSelectedFriend.friendData && FriendContextMenuSelectedFriend.friendData.uuid ? WriteToClipboard(FriendContextMenuSelectedFriend.friendData.uuid) : null}>{Localizations_ContextMenuItem("ContextMenuItem-CopyUUID")}</ContextMenuItem>
        <ContextMenuItem hide={!(FriendContextMenuSelectedFriend && FriendContextMenuSelectedFriend.status?.toLowerCase() === "request")} onLeftClick={() => FriendContextMenuSelectedFriend && FriendContextMenuSelectedFriend.friendData && FriendContextMenuSelectedFriend.friendData.uuid ? acceptFriendRequest(FriendContextMenuSelectedFriend) : null}>{Localizations_ContextMenuItem("ContextMenuItem-Accept")}</ContextMenuItem>
        <ContextMenuItem onLeftClick={() => FriendContextMenuSelectedFriend && FriendContextMenuSelectedFriend.friendData && FriendContextMenuSelectedFriend.friendData.uuid ? setRemoveFriendDialogSelector(FriendContextMenuSelectedFriend.friendData.uuid) : null}>{Localizations_ContextMenuItem("ContextMenuItem-Remove")}</ContextMenuItem>
        <ContextMenuItem onLeftClick={() => FriendContextMenuSelectedFriend && FriendContextMenuSelectedFriend.friendData && FriendContextMenuSelectedFriend.friendData.uuid ? setBlockFriendDialogSelector(FriendContextMenuSelectedFriend.friendData.uuid) : null}>{FriendContextMenuSelectedFriend && FriendContextMenuSelectedFriend.status && FriendContextMenuSelectedFriend.status?.toLowerCase() === "blocked" ? Localizations_ContextMenuItem("ContextMenuItem-Unblock") : Localizations_ContextMenuItem("ContextMenuItem-Block")}</ContextMenuItem>
      </ContextMenu>
    </PageContainer>
  );
}

export default FriendPage;
