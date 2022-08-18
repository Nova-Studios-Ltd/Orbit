import { useState } from "react";
import { Button, useTheme, Typography, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { SettingsManager } from "NSLib/SettingsManager";

import AvatarTextButton from "Components/Buttons/AvatarTextButton/AvatarTextButton";
import GenericDialog from "Components/Dialogs/GenericDialog/GenericDialog";
import ContextMenu from "Components/Menus/ContextMenu/ContextMenu";
import ContextMenuItem from "Components/Menus/ContextMenuItem/ContextMenuItem";

import type { NCComponent } from "DataTypes/Components";
import type { IRawChannelProps } from "Interfaces/IRawChannelProps";
import type { Coordinates } from "DataTypes/Types";

export interface ChannelProps extends NCComponent {
  channelData: IRawChannelProps,
  isSelected?: boolean,
  isGroup?: boolean,
  onChannelEdit?: (channel: IRawChannelProps) => void,
  onChannelDelete?: (channel: IRawChannelProps) => void,
  onClick?: (channel: IRawChannelProps) => void
}

function Channel(props: ChannelProps) {
  const theme = useTheme();
  const settings = new SettingsManager();
  const Localizations_GenericDialog = useTranslation("GenericDialog").t;
  const Localizations_Channel = useTranslation("Channel").t;

  const channelMembersThatIsNotYou: string[] = (() => {
    const membersThatArentYou: string[] = [];

    if (props.channelData && props.channelData.members) {
      for (let i = 0; i < props.channelData.members.length; i++) {
        if (props.channelData.members[i] !== settings.User.uuid) membersThatArentYou.push(props.channelData.members[i]);
      }
    }

    return membersThatArentYou;
  })();

  const [ChannelContextMenuVisible, setChannelContextMenuVisibility] = useState(false);
  const [ChannelContextMenuAnchorPos, setChannelContextMenuAnchorPos] = useState({} as unknown as Coordinates);
  const [ChannelInfoDialogVisible, setChannelInfoDialogVisibility] = useState(false);
  const [EditChannelDialogVisible, setEditChannelDialogVisibility] = useState(false);
  const [DeleteChannelDialogVisible, setDeleteChannelDialogVisibility] = useState(false);

  const onChannelLeftClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onClick) props.onClick(props.channelData);
  }

  const onChannelRightClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setChannelContextMenuAnchorPos({ x: event.clientX, y: event.clientY });
    setChannelContextMenuVisibility(true);
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
        <TextField label={Localizations_Channel("TextField_Label-ChannelInfoDialogMembers")} disabled value={channelMembersThatIsNotYou} />
      </GenericDialog>
      <ContextMenu open={ChannelContextMenuVisible} onDismiss={() => setChannelContextMenuVisibility(false)} anchorPos={ChannelContextMenuAnchorPos}>
        <ContextMenuItem onLeftClick={props.channelData.isGroup ? () => { setEditChannelDialogVisibility(true) } : () => { setChannelInfoDialogVisibility(true) }}>{props.channelData.isGroup ? Localizations_Channel("ContextMenuItem-Edit") : Localizations_Channel("ContextMenuItem-Info")}</ContextMenuItem>
        <ContextMenuItem onLeftClick={() => { setDeleteChannelDialogVisibility(true) }}>{Localizations_Channel("ContextMenuItem-Delete")}</ContextMenuItem>
      </ContextMenu>
    </>
  )
}

export default Channel;
