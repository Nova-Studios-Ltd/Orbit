// Global
import React, { useState } from "react";
import { Button, Checkbox, IconButton, Typography, useTheme } from "@mui/material";
import { Security as OwnerIcon } from "@mui/icons-material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

// Source
import { WriteToClipboard } from "Lib/ElectronAPI";

// Components
import AvatarTextButton from "Components/Buttons/AvatarTextButton/AvatarTextButton";
import ContextMenu from "Components/Menus/ContextMenu/ContextMenu";
import ContextMenuItem from "Components/Menus/ContextMenuItem/ContextMenuItem";
import GenericDialog from "Components/Dialogs/GenericDialog/GenericDialog";
import Separator from "Components/Menus/Separator/Separator";

// Types
import type { NCComponent } from "OldTypes/UI/Components";
import type Friend from "OldTypes/UI/Friend";
import type { Coordinates } from "OldTypes/General";
import { FriendButtonVariant, SelectionType } from "OldTypes/Enums";

export interface FriendButtonProps extends NCComponent {
  friend?: Friend,
  inSelectionMode?: boolean,
  selected?: boolean,
  variant?: FriendButtonVariant,
  hideUUID?: boolean,
  onLeftClick?: (checked: boolean, friend?: Friend) => void,
  onBlockFriend?: (uuid: string) => void,
  onUnblockFriend?: (uuid: string) => void,
  onRemoveFriend?: (uuid: string) => void,
  onKickRecipient?: (recipient: Friend) => void
}

function FriendButton(props: FriendButtonProps) {
  const theme = useTheme();
  const classNames = useClassNames("FriendButtonContainer", props.className);
  const Localizations_FriendButton = useTranslation("FriendButton").t;
  const Localizations_ContextMenuItem = useTranslation("ContextMenuItem").t;
  const Localizations_GenericDialog = useTranslation("GenericDialog").t;

  const isBlocked = props.friend?.status?.toLowerCase() === "blocked";

  const [FriendContextMenuVisible, setFriendContextMenuVisibility] = useState(false);
  const [FriendContextMenuAnchorPos, setFriendContextMenuAnchorPos] = useState({} as unknown as Coordinates);
  const [BlockUnblockFriendDialogVisible, setBlockUnblockFriendDialogVisible] = useState(false);
  const [RemoveFriendDialogVisible, setRemoveFriendDialogVisible] = useState(false);

  const onLeftClick = () => {
    if (props.onLeftClick) props.onLeftClick(!props.selected, props.friend);
  }

  const onRightClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFriendContextMenuAnchorPos({ x: event.clientX, y: event.clientY });
    setFriendContextMenuVisibility(true);
  }

  const onRemoveFriend = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onRemoveFriend && props.friend && props.friend.friendData) {
      props.onRemoveFriend(props.friend.friendData.uuid);
    }
    setRemoveFriendDialogVisible(false);
    event.stopPropagation();
  }

  const onBlockUnblockFriend = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isBlocked && props.onBlockFriend && props.friend && props.friend.friendData) {
      props.onBlockFriend(props.friend.friendData.uuid);
    }
    else if (props.onUnblockFriend && props.friend && props.friend.friendData) {
      props.onUnblockFriend(props.friend.friendData.uuid);
    }
    setBlockUnblockFriendDialogVisible(false);
    event.stopPropagation();
  }

  return (
    <div className={classNames}>
      {props.inSelectionMode ? <div className="FriendButtonSelectorContainer">
        <Checkbox checked={props.selected} onChange={onLeftClick} />
      </div> : null}
      <AvatarTextButton fullWidth showEllipsis selected={props.selected} selectionType={SelectionType.MultiSelect} iconSrc={props.friend?.friendData?.avatar} onLeftClick={onLeftClick} onRightClick={onRightClick} childrenAfter={
        <>
          {props.friend?.uiStates?.isOwner ? <IconButton disabled><OwnerIcon /></IconButton> : null}
        </>
      }>
        <div className="FriendButtonContent">
          <Typography>{props.friend?.friendData?.username}#{props.friend?.friendData?.discriminator}</Typography>
          {!props.hideUUID ? <Typography variant="caption" color="gray">{props.friend?.friendData?.uuid}</Typography> : null}
          {props.friend && props.friend.status ? <Typography variant="caption">{props.friend.status}</Typography> : null}
        </div>
      </AvatarTextButton>
      <GenericDialog sharedProps={props.sharedProps} onClose={() => setRemoveFriendDialogVisible(false)} open={RemoveFriendDialogVisible} title={Localizations_FriendButton("Typography-RemoveFriendDialogTitle", { user: props.friend?.friendData?.username })} buttons={
        <>
          <Button onClick={(event) => { setRemoveFriendDialogVisible(false); event.stopPropagation(); }}>{Localizations_GenericDialog("Button_Label-DialogCancel")}</Button>
          <Button color="error" onClick={onRemoveFriend}>{Localizations_GenericDialog("Button_Label-DialogRemove")}</Button>
        </>
      }>
        <div className="GenericDialogTextContainer">
          <Typography variant="body1">{Localizations_FriendButton("Typography-RemoveFriendDialogBlurb", { user: props.friend?.friendData?.username })}</Typography>
        </div>
      </GenericDialog>
      <GenericDialog sharedProps={props.sharedProps} onClose={() => setBlockUnblockFriendDialogVisible(false)} open={BlockUnblockFriendDialogVisible} title={isBlocked ? Localizations_FriendButton("Typography-UnblockFriendDialogTitle", { user: props.friend?.friendData?.username }) : Localizations_FriendButton("Typography-BlockFriendDialogTitle", { user: props.friend?.friendData?.username }) } buttons={
        <>
          <Button onClick={(event) => { setBlockUnblockFriendDialogVisible(false); event.stopPropagation() }}>{Localizations_GenericDialog("Button_Label-DialogCancel")}</Button>
          <Button color="error" onClick={onBlockUnblockFriend}>{isBlocked ? Localizations_GenericDialog("Button_Label-DialogUnblock") : Localizations_GenericDialog("Button_Label-DialogBlock")}</Button>
        </>
      }>
        <div className="GenericDialogTextContainer">
          <Typography variant="body1">{Localizations_FriendButton(isBlocked ? "Typography-UnblockFriendDialogBlurb" : "Typography-BlockFriendDialogBlurb", { user: props.friend?.friendData?.username })}</Typography>
        </div>
      </GenericDialog>
      <ContextMenu open={FriendContextMenuVisible} anchorPos={FriendContextMenuAnchorPos} onDismiss={() => setFriendContextMenuVisibility(false)}>
        {props.variant === FriendButtonVariant.DialogGroup ? <>
          <ContextMenuItem disabled={!props.friend?.uiStates?.removable} onLeftClick={() => props.onKickRecipient && props.friend ? props.onKickRecipient(props.friend) : null}>{Localizations_ContextMenuItem("ContextMenuItem-Remove")}</ContextMenuItem>
          <Separator />
        </> : null}
        <ContextMenuItem onLeftClick={() => props.friend && props.friend.friendData && props.friend.friendData.username && props.friend.friendData.discriminator ? WriteToClipboard(`${props.friend.friendData.username}#${props.friend.friendData.discriminator}`) : null}>{Localizations_ContextMenuItem("ContextMenuItem-CopyUser")}</ContextMenuItem>
        {!props.hideUUID ? <ContextMenuItem onLeftClick={() => props.friend && props.friend.friendData && props.friend.friendData.uuid ? WriteToClipboard(props.friend.friendData.uuid) : null}>{Localizations_ContextMenuItem("ContextMenuItem-CopyUUID")}</ContextMenuItem> : null}
        {props.friend && props.friend.status?.toLowerCase() === "request" ? <ContextMenuItem disabled={!props.onLeftClick} onLeftClick={onLeftClick}>{Localizations_ContextMenuItem("ContextMenuItem-Accept")}</ContextMenuItem> : null}
        {props.variant !== FriendButtonVariant.Blocked ? <ContextMenuItem disabled={!props.onRemoveFriend} onLeftClick={() => setRemoveFriendDialogVisible(true)}>{Localizations_ContextMenuItem("ContextMenuItem-Unfriend")}</ContextMenuItem> : null}
        <ContextMenuItem disabled={!props.onBlockFriend || !props.onUnblockFriend} onLeftClick={() => setBlockUnblockFriendDialogVisible(true)}>{props.friend?.status?.toLowerCase() === "blocked" ? Localizations_ContextMenuItem("ContextMenuItem-Unblock") : Localizations_ContextMenuItem("ContextMenuItem-Block")}</ContextMenuItem>
      </ContextMenu>
    </div>
  );
}

export default FriendButton;
