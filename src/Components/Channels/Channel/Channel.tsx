import { useState } from "react";
import { Button, useTheme, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import AvatarTextButton from "Components/Buttons/AvatarTextButton/AvatarTextButton";
import GenericDialog from "Components/Dialogs/GenericDialog/GenericDialog";

import type { ContextMenuItemProps } from "Components/Menus/ContextMenuItem/ContextMenuItem";
import type { NCComponent } from "DataTypes/Components";
import type { IRawChannelProps } from "Interfaces/IRawChannelProps";

export interface ChannelProps extends NCComponent {
  channelData: IRawChannelProps,
  isSelected?: boolean,
  onChannelEdit?: (channel: IRawChannelProps) => void,
  onChannelDelete?: (channel: IRawChannelProps) => void,
  onClick?: (channel: IRawChannelProps) => void
}

function Channel(props: ChannelProps) {
  const theme = useTheme();
  const Localizations_GenericDialog = useTranslation("GenericDialog").t;
  const Localizations_Channel = useTranslation("Channel").t;

  const [ChannelInfoDialogVisible, setChannelInfoDialogVisibility] = useState(false);
  const [EditChannelDialogVisible, setEditChannelDialogVisibility] = useState(false);
  const [DeleteChannelDialogVisible, setDeleteChannelDialogVisibility] = useState(false);

  const channelContextMenuItems: ContextMenuItemProps[] = [
    props.channelData.isGroup ? { children: Localizations_Channel("ContextMenuItem-Edit"), onLeftClick: () => { setEditChannelDialogVisibility(true) }} : { children: Localizations_Channel("ContextMenuItem-Info"), onLeftClick: () => { setChannelInfoDialogVisibility(true) }},
    { children: Localizations_Channel("ContextMenuItem-Delete"), onLeftClick: () => { setDeleteChannelDialogVisibility(true) }}
  ]

  const onChannelLeftClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onClick) props.onClick(props.channelData);
  }

  const onChannelRightClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.sharedProps && props.sharedProps.ContextMenu && event.currentTarget) {
      props.sharedProps.ContextMenu.setItems(channelContextMenuItems);
      props.sharedProps.ContextMenu.setAnchor({ x: event.clientX, y: event.clientY });
      props.sharedProps.ContextMenu.setVisibility(true);
    }
    event.preventDefault();
  }

  const editChannel = () => {
    if (props.onChannelEdit) props.onChannelEdit(props.channelData);
    // TODO: Implement channel editing logic
    setEditChannelDialogVisibility(false);
  }

  const deleteChannel = () => {
    if (props.onChannelDelete) props.onChannelDelete(props.channelData);
    setDeleteChannelDialogVisibility(false);
  }

  return (
    <>
      <AvatarTextButton sharedProps={props.sharedProps} showEllipsisConditional iconSrc={props.channelData.channelIcon} selected={props.isSelected} onLeftClick={onChannelLeftClick} onRightClick={onChannelRightClick}>
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
      <GenericDialog onClose={() => setEditChannelDialogVisibility(false)} open={EditChannelDialogVisible} title={Localizations_Channel("Typography-EditChannelDialogTitle", { channelName: props.channelData.channelName })} buttons={
        <>
          <Button onClick={() => setEditChannelDialogVisibility(false)}>{Localizations_GenericDialog("Button_Label-DialogCancel")}</Button>
          <Button color="success" onClick={() => editChannel()}>{Localizations_GenericDialog("Button_Label-DialogSave")}</Button>
        </>
      }>
        [Insert Channel Editing Stuff Here]
      </GenericDialog>
      <GenericDialog onClose={() => setChannelInfoDialogVisibility(false)} open={ChannelInfoDialogVisible} title={Localizations_Channel("Typography-ChannelInfoDialogTitle", { channelName: props.channelData.channelName })} buttons={
        <>
          <Button onClick={() => setChannelInfoDialogVisibility(false)}>{Localizations_GenericDialog("Button_Label-DialogOK")}</Button>
        </>
      }>
        [Insert Channel Info Here]
      </GenericDialog>
    </>

  )
}

export default Channel;
