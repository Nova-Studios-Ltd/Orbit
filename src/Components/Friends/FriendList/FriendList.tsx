import { useState } from "react";
import { Button, Typography, useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import FriendButton from "Components/Friends/FriendButton/FriendButton";

import type { NCComponent } from "Types/UI/Components";
import type Friend from "Types/UI/Friend";
import { FriendButtonVariant } from "Types/Enums";

export interface FriendListProps extends NCComponent {
  friends?: Friend[],
  inSelectionMode?: boolean,
  hideButtons?: boolean,
  hideUUIDs?: boolean,
  variant?: FriendButtonVariant,
  fullWidth?: boolean,
  emptyPlaceholderHeader?: string,
  emptyPlaceholderBody?: string,
  onReloadList?: () => void,
  onFriendClicked?: (friend: Friend) => void,
  onCreateGroup?: (recipients: Friend[]) => void,
  onRemoveFriend?: (uuid: string) => void,
  onBlockFriend?: (uuid: string) => void,
  onUnblockFriend?: (uuid: string) => void,
  onKickRecipient?: (recipient: Friend) => void
}

function FriendList(props: FriendListProps) {
  const theme = useTheme();
  const classNames = useClassNames(useClassNames("FriendListContainer", props.className), props.fullWidth ? "FullWidth" : "");
  const Localizations_Button = useTranslation("Button").t;
  const Localizations_FriendList = useTranslation("FriendList").t;

  const [GroupChannelRecipientsList, setGroupChannelRecipientsList] = useState([] as Friend[]);

  const friendIsInRecipientsList = (friend: Friend) => {
    for (let i = 0; i < GroupChannelRecipientsList.length; i++) {
      const selectedFriend = GroupChannelRecipientsList[i];
      if (selectedFriend.friendData?.uuid === friend.friendData?.uuid) return true;
    }

    return false;
  }

  const onCreateGroup = (cancel?: boolean) => {
    if (props.onCreateGroup) props.onCreateGroup(cancel ? [] : GroupChannelRecipientsList);
    setGroupChannelRecipientsList([]);
  }

  const onReloadList = () => {
    if (props.onReloadList) props.onReloadList();
  }

  const onFriendClicked = (friend?: Friend) => {
    if (friend && props.onFriendClicked) props.onFriendClicked(friend);
  }

  const onFriendTicked = (checked: boolean, friend: Friend) => {
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
      const elements = props.friends.map((friend, index) => {
        if (!friend.friendData) return null;

        const isBlocked = friend.status?.state === "Blocked";

        if ((isBlocked && (props.variant !== (FriendButtonVariant.Blocked || FriendButtonVariant.All))) || (!isBlocked && props.variant === FriendButtonVariant.Blocked)) return null;

        const ticked = friendIsInRecipientsList(friend);

        const onLeftClick = (checked: boolean, _friend?: Friend) => {
          if (_friend === undefined) return;
          if (props.inSelectionMode) {
            onFriendTicked(checked, _friend);
            return;
          }

          onFriendClicked(_friend);
        }

        return (<FriendButton key={friend.friendData && friend.friendData.uuid ? friend.friendData.uuid : index} friend={friend} inSelectionMode={props.inSelectionMode} selected={ticked} variant={props.variant} hideUUID={props.hideUUIDs} onLeftClick={onLeftClick} onBlockFriend={props.onBlockFriend} onUnblockFriend={props.onUnblockFriend} onRemoveFriend={props.onRemoveFriend} onKickRecipient={props.onKickRecipient} />)
      });

      const reducedElements = [];

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];

        if (element !== null || undefined) reducedElements.push(element);
      }

      return reducedElements;
    }
  })()

  return (
    <div className={classNames}>
      {!props.hideButtons ?
        <div className="FriendListButtonContainer">
          {props.inSelectionMode ? <Button disabled={GroupChannelRecipientsList.length < 1} variant="outlined" color="success" onClick={() => onCreateGroup()}>{Localizations_FriendList("Button_Label-CreateGroupChannel")}</Button> : null}
          {props.inSelectionMode ? <Button variant="outlined" color="error" onClick={() => onCreateGroup(true)}>{Localizations_Button("Button_Label-Cancel")}</Button> : null}
          <Button variant="outlined" style={{ marginLeft: "auto" }} onClick={onReloadList}>{Localizations_FriendList("Button_Label-ReloadFriendsList")}</Button>
        </div>
      : null}
      {(!friendElements || friendElements.length < 1) && (props.emptyPlaceholderHeader !== undefined || props.emptyPlaceholderBody !== undefined) ?
        <div className="NoEntriesHintContainer">
          <Typography variant="h6">{props.emptyPlaceholderHeader}</Typography>
          <Typography variant="body1">{props.emptyPlaceholderBody}</Typography>
        </div>
      : null}
      <div className="FriendEntriesContainer">
        {friendElements}
      </div>
    </div>
  );
}

export default FriendList;
