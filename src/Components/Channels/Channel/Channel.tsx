import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import type { NCComponent } from "DataTypes/Components";
import { ChannelType } from "DataTypes/Enums";
import { ContextMenuItemProps } from "Components/Menus/ContextMenuItem/ContextMenuItem";
import AvatarTextButton from "Components/Buttons/AvatarTextButton/AvatarTextButton";

export interface ChannelProps extends NCComponent {
  channelName?: string,
  channelID?: string,
  channelIconSrc?: string,
  channelMembers?: string[],
  isGroup?: ChannelType,
  isSelected?: boolean,
  onChannelEdit?: (channel: ChannelProps) => void,
  onChannelDelete?: (channel: ChannelProps) => void,
  onClick?: (channel: ChannelProps) => void
}

function Channel(props: ChannelProps) {
  const theme = useTheme();
  const Localizations_Channel = useTranslation("Channel").t;
  const filteredChannelProps: ChannelProps = { channelName: props.channelName, channelID: props.channelID, channelIconSrc: props.channelIconSrc, channelMembers: props.channelMembers, isGroup: props.isGroup, isSelected: props.isSelected };

  const channelContextMenuItems: ContextMenuItemProps[] = [
    { children: Localizations_Channel("ContextMenuItem-Edit"), onLeftClick: () => { if (props.onChannelEdit) props.onChannelEdit(filteredChannelProps) }},
    { children: Localizations_Channel("ContextMenuItem-Delete"), onLeftClick: () => { if (props.onChannelDelete) props.onChannelDelete(filteredChannelProps) }}
  ]

  const onChannelLeftClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onClick) props.onClick(filteredChannelProps);
  }

  const onChannelRightClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.sharedProps && props.sharedProps.ContextMenu && event.currentTarget) {
      props.sharedProps.ContextMenu.setItems(channelContextMenuItems);
      props.sharedProps.ContextMenu.setAnchor({ x: event.clientX, y: event.clientY });
      props.sharedProps.ContextMenu.setVisibility(true);
    }
    event.preventDefault();
  }

  return (
    <AvatarTextButton sharedProps={props.sharedProps} iconSrc={props.channelIconSrc} selected={props.isSelected} onLeftClick={onChannelLeftClick} onRightClick={onChannelRightClick}>
      {props.channelName}
    </AvatarTextButton>
  )
}

export default Channel;
