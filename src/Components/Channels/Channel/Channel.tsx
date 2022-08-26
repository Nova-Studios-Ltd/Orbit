import React, { useEffect, useState } from "react";
import { Avatar, Button, Icon, IconButton, useTheme, Typography, CircularProgress } from "@mui/material";
import { Add as AddIcon, Group as GroupIcon, Security as OwnerIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { SettingsManager } from "NSLib/SettingsManager";
import useClassNames from "Hooks/useClassNames";
import { GETUser, SETAvatar } from "NSLib/APIEvents";
import { NCFile, UploadFile } from "NSLib/ElectronAPI";

import AvatarTextButton from "Components/Buttons/AvatarTextButton/AvatarTextButton";
import ContextMenu from "Components/Menus/ContextMenu/ContextMenu";
import ContextMenuItem from "Components/Menus/ContextMenuItem/ContextMenuItem";
import GenericDialog from "Components/Dialogs/GenericDialog/GenericDialog";
import TextCombo from "Components/Input/TextCombo/TextCombo";

import type { NCComponent } from "DataTypes/Components";
import type { IRawChannelProps } from "Interfaces/IRawChannelProps";
import type { ChannelMoveData, Coordinates } from "DataTypes/Types";
import type IUserData from "Interfaces/IUserData";
import type { IChannelUpdateProps } from "Interfaces/IChannelUpdateProps";

export interface ChannelProps extends NCComponent {
  channelData: IRawChannelProps,
  index: number,
  isSelected?: boolean,
  onChannelClick?: (channel: IRawChannelProps) => void,
  onChannelClearCache?: (channel: IRawChannelProps) => void,
  onChannelDelete?: (channel: IRawChannelProps) => void,
  onChannelEdit?: (channel: IChannelUpdateProps) => void,
  onChannelMove?: (currentChannel: IRawChannelProps, otherChannel: IRawChannelProps, index: number) => void,
  onChannelResetIcon?: (channel: IRawChannelProps) => void
}

function Channel(props: ChannelProps) {
  const theme = useTheme();
  const settings = new SettingsManager();
  const classNames = useClassNames("ChannelContainer", props.className);
  const Localizations_GenericDialog = useTranslation("GenericDialog").t;
  const Localizations_Channel = useTranslation("Channel").t;
  const Localizations_ContextMenuItem = useTranslation("ContextMenuItem").t;

  const [ChannelContextMenuChangeTitleTextField, setChannelContextMenuChangeTitleTextField] = useState("");
  const [ChannelContextMenuIconFile, setChannelContextMenuIconFile] = useState(null as unknown as NCFile);
  const [ChannelContextMenuIconPreview, setChannelContextMenuIconPreview] = useState(props.channelData.channelIcon);
  const [ChannelContextMenuVisible, setChannelContextMenuVisibility] = useState(false);
  const [ChannelContextMenuAnchorPos, setChannelContextMenuAnchorPos] = useState({} as unknown as Coordinates);
  const [ChannelInfoDialogVisible, setChannelInfoDialogVisibility] = useState(false);
  const [EditChannelDialogVisible, setEditChannelDialogVisibility] = useState(false);
  const [DeleteChannelDialogVisible, setDeleteChannelDialogVisibility] = useState(false);
  const [ChannelMembersUserData, setChannelMembersUserData] = useState([] as IUserData[]);

  useEffect(() => {
    const channelMembers: IUserData[] = [];

    if (props.channelData && props.channelData.members) {
      for (let i = 0; i < props.channelData.members.length; i++) {
        const uuid = props.channelData.members[i];
          GETUser(uuid).then((user) => {
            if (user) {
              channelMembers.push(user);
              return;
            }
            console.error(`Failed to get user data with UUID ${uuid}`);
          });
      }
      setChannelMembersUserData(channelMembers);
    }
  }, [props.channelData, settings.User.uuid]);

  const onChannelLeftClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onChannelClick) props.onChannelClick(props.channelData);
  }

  const onChannelRightClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setChannelContextMenuAnchorPos({ x: event.clientX, y: event.clientY });
    setChannelContextMenuVisibility(true);
    event.preventDefault();
  }

  const closeEditChannelDialog = () => {
    setChannelContextMenuChangeTitleTextField("");
    setChannelContextMenuIconFile(null as unknown as NCFile);
    setChannelContextMenuIconPreview(props.channelData.channelIcon);
    setEditChannelDialogVisibility(false);
  }

  const editChannel = () => {
    const newChannelData: IChannelUpdateProps = {
      table_Id: props.channelData.table_Id,
      owner_UUID: props.channelData.owner_UUID,
      isGroup: props.channelData.isGroup,
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
    UploadFile(false).then((files: NCFile[]) => {
      if (files.length === 0) return;
      setChannelContextMenuIconFile(files[0]);
      setChannelContextMenuIconPreview(URL.createObjectURL(new Blob([files[0].FileContents])));
    });
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

  const channelMembersList = (() => {
    const channelMembersEl: JSX.Element[] = [];

    for (let i = 0; i < ChannelMembersUserData.length; i++) {
      const user = ChannelMembersUserData[i];

      channelMembersEl.push(
        <AvatarTextButton key={user.uuid} fullWidth iconSrc={user.avatar} childrenAfter={
          props.channelData.isGroup && props.channelData.owner_UUID === user.uuid ? <Icon><OwnerIcon /></Icon> : null
        }>{user.username}</AvatarTextButton>
      );
    }

    return (
      <div className="ChannelMembersListContainer">
        <Typography variant="h6">{Localizations_Channel("Typography-ChannelMembersListTitle")}</Typography>
        {channelMembersEl.length < 1 ? <CircularProgress /> : null}
        {channelMembersEl}
      </div>
    )
  })()

  return (
    <div className={classNames}>
      <AvatarTextButton sharedProps={props.sharedProps} showEllipsisConditional draggable onDrag={onChannelDrag} onDrop={onOtherChannelDropped} iconSrc={props.channelData.channelIcon} selected={props.isSelected} onLeftClick={onChannelLeftClick} onRightClick={onChannelRightClick} childrenAfter={
        (props && props.channelData.isGroup) ? <Icon><GroupIcon /></Icon> : null
      }>
        {props.channelData.channelName}
      </AvatarTextButton>
      <GenericDialog sharedProps={props.sharedProps} onClose={() => setDeleteChannelDialogVisibility(false)} open={DeleteChannelDialogVisible} title={Localizations_Channel("Typography-DeleteChannelDialogTitle", { channelName: props.channelData.channelName })} buttons={
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
      <GenericDialog sharedProps={props.sharedProps} onClose={() => closeEditChannelDialog()} open={EditChannelDialogVisible} title={Localizations_Channel("Typography-EditChannelDialogTitle", { channelName: props.channelData.channelName })} buttons={
        <>
          <Button onClick={() => closeEditChannelDialog()}>{Localizations_GenericDialog("Button_Label-DialogCancel")}</Button>
          <Button color="success" onClick={() => editChannel()}>{Localizations_GenericDialog("Button_Label-DialogSave")}</Button>
        </>
      }>
        {channelMembersList}
        <div className="GenericDialogTextContainer">
          <Typography>{Localizations_Channel("Typography-ChangeChannelIcon")}</Typography>
          <div style={{ alignSelf: "center" }}>
            <IconButton className="OverlayContainer" onClick={pickChannelIcon}>
              <Avatar sx={{ width: 128, height: 128 }} src={ChannelContextMenuIconPreview}/>
              <AddIcon fontSize="large" className="Overlay" color="inherit" />
            </IconButton>
          </div>
          <Button variant="outlined" color="error" onClick={() => props.onChannelResetIcon ? props.onChannelResetIcon(props.channelData) : null}>{Localizations_Channel("Button_Label-ResetIcon")}</Button>
        </div>
        <div className="GenericDialogTextContainer">
          <Typography>{Localizations_Channel("Typography-ChangeChannelName")}</Typography>
          <TextCombo submitButton={false} placeholder={props.channelData.channelName} onChange={(e) => (e.value !== undefined) ? setChannelContextMenuChangeTitleTextField(e.value) : null} value={ChannelContextMenuChangeTitleTextField}></TextCombo>
        </div>
        <Button variant="outlined" onClick={clearChannelCache}>{Localizations_Channel("Button_Label-ClearCache")}</Button>
      </GenericDialog>
      <GenericDialog sharedProps={props.sharedProps} onClose={() => setChannelInfoDialogVisibility(false)} open={ChannelInfoDialogVisible} title={Localizations_Channel("Typography-ChannelInfoDialogTitle", { channelName: props.channelData.channelName })} buttons={
        <>
          <Button onClick={() => setChannelInfoDialogVisibility(false)}>{Localizations_GenericDialog("Button_Label-DialogOK")}</Button>
        </>
      }>
        {channelMembersList}
        <Button variant="outlined" onClick={clearChannelCache}>{Localizations_Channel("Button_Label-ClearCache")}</Button>
      </GenericDialog>
      <ContextMenu open={ChannelContextMenuVisible} onDismiss={() => setChannelContextMenuVisibility(false)} anchorPos={ChannelContextMenuAnchorPos}>
        <ContextMenuItem onLeftClick={props.channelData.isGroup ? () => { setEditChannelDialogVisibility(true) } : () => { setChannelInfoDialogVisibility(true) }}>{props.channelData.isGroup ? Localizations_ContextMenuItem("ContextMenuItem-Edit") : Localizations_ContextMenuItem("ContextMenuItem-Info")}</ContextMenuItem>
        <ContextMenuItem onLeftClick={() => { setDeleteChannelDialogVisibility(true) }}>{Localizations_ContextMenuItem("ContextMenuItem-Delete")}</ContextMenuItem>
      </ContextMenu>
    </div>
  )
}

export default Channel;
