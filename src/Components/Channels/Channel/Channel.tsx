import { Avatar, ButtonBase, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";

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

function Channel({ ContextMenu, channelName, channelID, channelIconSrc, channelMembers, isGroup, isSelected, onChannelEdit, onChannelDelete, onClick }: ChannelProps) {
  const theme = useTheme();
  const Localizations_Channel = useTranslation("Channel").t;
  const filteredChannelProps: ChannelProps = { channelName, channelID, channelIconSrc, channelMembers, isGroup, isSelected };

  const channelContextMenuItems: ContextMenuItemProps[] = [
    { children: Localizations_Channel("ContextMenuItem-Edit"), onLeftClick: () => { if (onChannelEdit) onChannelEdit(filteredChannelProps) }},
    { children: Localizations_Channel("ContextMenuItem-Delete"), onLeftClick: () => { if (onChannelDelete) onChannelDelete(filteredChannelProps) }}
  ]

  const channelClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(filteredChannelProps);
  }

  const channelRightClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (ContextMenu && event.currentTarget) {
      ContextMenu.setAnchor({ x: event.clientX, y: event.clientY });
      ContextMenu.setItems(channelContextMenuItems);
      ContextMenu.setVisibility(true);
    }
    event.preventDefault();
  }

  return (
    <AvatarTextButton iconSrc={channelIconSrc} selected={isSelected} onLeftClick={channelClickHandler} onRightClick={channelRightClickHandler}>
      {channelName}
    </AvatarTextButton>
  )
}

export default Channel;
