// Global
import React, { useEffect, useState } from "react";
import { Avatar, Button, Icon, IconButton, useTheme, Typography } from "@mui/material";
import { Add as AddIcon, AddCircle as AddFilledIcon, Group as GroupIcon, FolderSpecial as FolderIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

// Source
import { NCFile, UploadFile } from "Lib/ElectronAPI";
import useClassNames from "Hooks/useClassNames";
import UserData from "Lib/Storage/Objects/UserData";

// Components
import AvatarTextButton from "Components/Buttons/AvatarTextButton/AvatarTextButton";
import ContextMenu from "Components/Menus/ContextMenu/ContextMenu";
import ContextMenuItem from "Components/Menus/ContextMenuItem/ContextMenuItem";
import FriendList from "Components/Friends/FriendList/FriendList";
import GenericButton from "Components/Buttons/GenericButton/GenericButton";
import GenericDialog from "Components/Dialogs/GenericDialog/GenericDialog";
import TextCombo from "Components/Input/TextCombo/TextCombo";

// Types
import type { NCComponent } from "Types/UI/Components";
import type { ChannelMoveData, Coordinates } from "Types/General";
import type IUserData from "Types/API/Interfaces/IUserData";
import type { IChannelUpdateProps } from "Types/API/Interfaces/IChannelUpdateProps";
import { ChannelTypes, FriendButtonVariant } from "Types/Enums";
import type Friend from "Types/UI/Friend";
import type { INotSoRawChannelProps } from "Types/API/Interfaces/INotSoRawChannelProps";

export interface ChannelProps extends NCComponent {
  channelData: INotSoRawChannelProps,
  index: number,
  selected?: boolean,
  onChannelClick?: (channel: INotSoRawChannelProps) => void,
  onChannelClearCache?: (channel: INotSoRawChannelProps) => void,
  onChannelDelete?: (channel: INotSoRawChannelProps) => void,
  onChannelEdit?: (channel: IChannelUpdateProps) => void,
  onChannelMove?: (currentChannel: INotSoRawChannelProps, otherChannel: INotSoRawChannelProps, index: number) => void,
  onChannelRemoveRecipient?: (channel: INotSoRawChannelProps, recipient: IUserData) => void,
  onChannelResetIcon?: (channel: INotSoRawChannelProps) => void,
  onReloadList?: () => void,
  onChannelFriendClicked?: (friend: Friend) => void,
  onCreateGroup?: (recipients: Friend[]) => void,
  onRemoveFriend?: (uuid: string) => void,
  onBlockFriend?: (uuid: string) => void,
  onUnblockFriend?: (uuid: string) => void
}

function Channel(props: ChannelProps) {
  const theme = useTheme();
  const classNames = useClassNames("ChannelContainer", props.className);
  const Localizations_GenericDialog = useTranslation("GenericDialog").t;
  const Localizations_Channel = useTranslation("Channel").t;
  const Localizations_ContextMenuItem = useTranslation("ContextMenuItem").t;

  const isOwner = props.channelData.owner_UUID === UserData.Uuid;
  const isGroup = props && props.channelData.channelType === ChannelTypes.GroupChannel;
  const isFileTransfer = props && props.channelData.channelType === ChannelTypes.PrivateChannel;

  const [ChannelContextMenuChangeTitleTextField, setChannelContextMenuChangeTitleTextField] = useState("");
  const [ChannelContextMenuIconFile, setChannelContextMenuIconFile] = useState(null as unknown as NCFile);
  const [ChannelContextMenuIconPreview, setChannelContextMenuIconPreview] = useState(props.channelData.channelIcon);
  const [ChannelContextMenuVisible, setChannelContextMenuVisibility] = useState(false);
  const [ChannelContextMenuAnchorPos, setChannelContextMenuAnchorPos] = useState({} as unknown as Coordinates);
  const [ChannelInfoDialogVisible, setChannelInfoDialogVisibility] = useState(false);
  const [EditChannelDialogVisible, setEditChannelDialogVisibility] = useState(false);
  const [DeleteChannelDialogVisible, setDeleteChannelDialogVisibility] = useState(false);

  const onKickRecipient = (recipient: Friend) => {
    if (props.onChannelRemoveRecipient && recipient.friendData) props.onChannelRemoveRecipient(props.channelData, recipient.friendData);
  }

  const onChannelFriendClicked = (friend: Friend) => {
    if (props.onChannelFriendClicked) props.onChannelFriendClicked(friend);
  }

  const onChannelLeftClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onChannelClick) props.onChannelClick(props.channelData);
  }

  const onChannelRightClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setChannelContextMenuAnchorPos({ x: event.clientX, y: event.clientY });
    setChannelContextMenuVisibility(true);
    event.preventDefault();
  }

  const openEditChannelDialog = () => {
    setChannelContextMenuChangeTitleTextField("");
    setChannelContextMenuIconFile(null as unknown as NCFile);
    setChannelContextMenuIconPreview(props.channelData.channelIcon);
    setEditChannelDialogVisibility(true);
  }

  const closeEditChannelDialog = () => {
    setChannelContextMenuChangeTitleTextField("");
    setEditChannelDialogVisibility(false);
  }

  const editChannel = () => {
    const newChannelData: IChannelUpdateProps = {
      table_Id: props.channelData.table_Id,
      owner_UUID: props.channelData.owner_UUID,
      channelType: props.channelData.channelType,
      channelName: (ChannelContextMenuChangeTitleTextField.length > 0 && props.channelData.channelName !== ChannelContextMenuChangeTitleTextField) ? ChannelContextMenuChangeTitleTextField : props.channelData.channelName,
      channelIcon: ChannelContextMenuIconFile,
      members: props.channelData.members
    };

    if (props.onChannelEdit) props.onChannelEdit(newChannelData);
    closeEditChannelDialog();
  }

  const deleteChannel = () => {
    if (props.onChannelDelete) props.onChannelDelete(props.channelData);
    setDeleteChannelDialogVisibility(false);
  }

  const pickChannelIcon = async () => {
    if (isOwner) {
      UploadFile(false).then((files: NCFile[]) => {
        if (files.length === 0) return;
        setChannelContextMenuIconFile(files[0]);
        setChannelContextMenuIconPreview(URL.createObjectURL(new Blob([files[0].FileContents])));
      });
    }
  }

  const onAddNewRecipient = (event: React.MouseEvent<HTMLButtonElement>) => {

  }

  const clearChannelCache = () => {
    if (props.onChannelClearCache) props.onChannelClearCache(props.channelData);
  }

  const onChannelDrag = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("text/plain", JSON.stringify({ channelData: props.channelData, index: props.index } as ChannelMoveData));
    event.dataTransfer.effectAllowed = "copy";
  }

  const onOtherChannelDropped = (event: React.DragEvent<HTMLSpanElement>) => {
    const rawData = event.dataTransfer?.getData("text");
    if (rawData && rawData.length > 0) {
      try {
        const moveData: ChannelMoveData = JSON.parse(rawData);

        if (moveData && props.onChannelMove) {
          props.onChannelMove(props.channelData, moveData.channelData, props.index);
        }
      }
      catch {
        console.error("Channel drop event did not contain any JSON data");
      }
    }
  }

  const channelSymbol = () => {
    if (isGroup) {
      return (
        <Icon>
          <GroupIcon />
        </Icon>
      );
    }
    else if (isFileTransfer) {
      return (
        <Icon>
          <FolderIcon />
        </Icon>
      );
    }

    return null;
  }

  return (
    <div className={classNames}>
      <AvatarTextButton className="ChannelAvatarTextButtonContainer" showEllipsisConditional draggable onDrag={onChannelDrag} onDrop={onOtherChannelDropped} iconSrc={props.channelData.channelIcon} selected={props.selected} onLeftClick={onChannelLeftClick} onRightClick={onChannelRightClick} childrenAfter={
        channelSymbol()
      }>
        {props.channelData.channelName}
      </AvatarTextButton>
      <GenericDialog onClose={() => setDeleteChannelDialogVisibility(false)} open={DeleteChannelDialogVisible} title={Localizations_Channel("Typography-DeleteChannelDialogTitle", { channelName: props.channelData.channelName })} buttons={
        <>
          <Button onClick={() => setDeleteChannelDialogVisibility(false)}>{Localizations_GenericDialog("Button_Label-DialogCancel")}</Button>
          <Button color="error" onClick={() => deleteChannel()}>{Localizations_GenericDialog("Button_Label-DialogDelete")}</Button>
        </>
      }>
        <div className="GenericDialogTextContainer">
          <Typography variant="body1">{Localizations_Channel("Typography-DeleteChannelBlurb1")}</Typography>
          <Typography variant="body1">{Localizations_Channel("Typography-DeleteChannelBlurb2")}</Typography>
        </div>
      </GenericDialog>
      <GenericDialog onClose={() => closeEditChannelDialog()} open={EditChannelDialogVisible} title={isOwner ? Localizations_Channel("Typography-EditChannelDialogTitle", { channelName: props.channelData.channelName }) : Localizations_Channel("Typography-ChannelInfoDialogTitle", { channelName: props.channelData.channelName })} buttons={
        isOwner ? (<>
          <Button onClick={() => closeEditChannelDialog()}>{Localizations_GenericDialog("Button_Label-DialogCancel")}</Button>
          <Button color="success" onClick={() => editChannel()}>{Localizations_GenericDialog("Button_Label-DialogSave")}</Button>
        </>) :
        (
          <>
            <Button onClick={() => setEditChannelDialogVisibility(false)}>{Localizations_GenericDialog("Button_Label-DialogOK")}</Button>
          </>
        )
      }>
        <div className="GenericDialogTextContainer">
          <Typography variant="h6">{Localizations_Channel("Typography-ChangeChannelIcon")}</Typography>
          <div style={{ alignSelf: "center" }}>
            <IconButton className="OverlayContainer" disabled={!isOwner} onClick={pickChannelIcon}>
              <Avatar sx={{ width: 128, height: 128 }} src={ChannelContextMenuIconPreview}/>
              <AddIcon fontSize="large" className="Overlay" color="inherit" />
            </IconButton>
          </div>
          <Button variant="outlined" color="error" disabled={!isOwner} onClick={() => isOwner && props.onChannelResetIcon ? props.onChannelResetIcon(props.channelData) : null}>{Localizations_Channel("Button_Label-ResetIcon")}</Button>
        </div>
        <div className="GenericDialogTextContainer">
          <Typography variant="h6">{Localizations_Channel("Typography-ChangeChannelName")}</Typography>
          <TextCombo submitButton={false} disabled={!isOwner} placeholder={props.channelData.channelName} onChange={(e) => (e.value !== undefined) ? setChannelContextMenuChangeTitleTextField(e.value) : null} value={ChannelContextMenuChangeTitleTextField}></TextCombo>
        </div>
        <div className="ChannelMembersListContainer">
          <Typography variant="h6">{Localizations_Channel("Typography-ChannelMembersListTitle")}</Typography>
          <FriendList fullWidth variant={FriendButtonVariant.DialogGroup} friends={props.channelData.ui?.members} onReloadList={props.onReloadList} onFriendClicked={onChannelFriendClicked} onKickRecipient={onKickRecipient} />
          <GenericButton fullWidth onLeftClick={onAddNewRecipient}><Icon style={{ margin: "auto" }}><AddFilledIcon /></Icon></GenericButton>
        </div>
        <Button variant="outlined" onClick={clearChannelCache}>{Localizations_Channel("Button_Label-ClearCache")}</Button>
      </GenericDialog>
      <GenericDialog onClose={() => setChannelInfoDialogVisibility(false)} open={ChannelInfoDialogVisible} title={Localizations_Channel("Typography-ChannelInfoDialogTitle", { channelName: props.channelData.channelName })} buttons={
        <>
          <Button onClick={() => setChannelInfoDialogVisibility(false)}>{Localizations_GenericDialog("Button_Label-DialogOK")}</Button>
        </>
      }>
        <div className="ChannelMembersListContainer">
          <Typography variant="h6">{Localizations_Channel("Typography-ChannelMembersListTitle")}</Typography>
          <FriendList fullWidth variant={FriendButtonVariant.DialogSingle} friends={props.channelData.ui?.members} onKickRecipient={onKickRecipient} />
        </div>
        <Button variant="outlined" onClick={clearChannelCache}>{Localizations_Channel("Button_Label-ClearCache")}</Button>
      </GenericDialog>
      <ContextMenu open={ChannelContextMenuVisible} onDismiss={() => setChannelContextMenuVisibility(false)} anchorPos={ChannelContextMenuAnchorPos}>
        <ContextMenuItem onLeftClick={isGroup ? () => { openEditChannelDialog() } : () => { setChannelInfoDialogVisibility(true) }}>{isGroup ? (isOwner ? Localizations_ContextMenuItem("ContextMenuItem-Edit") : Localizations_ContextMenuItem("ContextMenuItem-Info")) : Localizations_ContextMenuItem("ContextMenuItem-Info")}</ContextMenuItem>
        <ContextMenuItem onLeftClick={() => { setDeleteChannelDialogVisibility(true) }}>{Localizations_ContextMenuItem("ContextMenuItem-Delete")}</ContextMenuItem>
      </ContextMenu>
    </div>
  )
}

export default Channel;
