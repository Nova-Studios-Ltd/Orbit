import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import type { NCComponent } from "DataTypes/Components";
import { ContextMenuItemProps } from "Components/Menus/ContextMenuItem/ContextMenuItem";
import AvatarTextButton from "Components/Buttons/AvatarTextButton/AvatarTextButton";

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
  const Localizations_Channel = useTranslation("Channel").t;

  const channelContextMenuItems: ContextMenuItemProps[] = [
    { children: Localizations_Channel("ContextMenuItem-Edit"), onLeftClick: () => { if (props.onChannelEdit) props.onChannelEdit(props.channelData) }},
    { children: Localizations_Channel("ContextMenuItem-Delete"), onLeftClick: () => { if (props.onChannelDelete) props.onChannelDelete(props.channelData) }}
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

  return (
    <AvatarTextButton sharedProps={props.sharedProps} showEllipsisConditional iconSrc={props.channelData.channelIcon} selected={props.isSelected} onLeftClick={onChannelLeftClick} onRightClick={onChannelRightClick}>
      {props.channelData.channelName}
    </AvatarTextButton>
  )
}

export default Channel;
