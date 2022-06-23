import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dictionary } from "NSLib/Dictionary";
import { Typography } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import PageContainer from "Components/Containers/PageContainer/PageContainer";
import AvatarTextButton from "Components/Buttons/AvatarTextButton/AvatarTextButton";

import type { Page } from "DataTypes/Components";
import type Friend from "DataTypes/Friend";
import type { ContextMenuItemProps } from "Components/Menus/ContextMenuItem/ContextMenuItem";

interface FriendPageProps extends Page {
  friends?: Friend[],
  onFriendClicked?: (friend: Friend) => void,
  onAddFriend?: (recipient: string) => void,
  onRemoveFriend?: (uuid: string) => void
}

function FriendPage(props: FriendPageProps) {
  const Localizations_FriendPage = useTranslation("FriendListPage").t;
  const classNames = useClassNames("FriendPageContainer", props.className);

  const removeFriend = (uuid?: string) => {
    if (uuid && props.onRemoveFriend) props.onRemoveFriend(uuid);
  }

  const friendElements = (() => {
    if (props.friends) {
      return props.friends.map((friend) => {
        if (!friend.friendData) return null;

        const friendContextMenuItems: ContextMenuItemProps[] = [
          { children: Localizations_FriendPage("ContextMenuItem-RemoveFriend"), onLeftClick: () => removeFriend(friend.friendData?.uuid)},
        ];

        const friendRightClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
          if (props.sharedProps && props.sharedProps.ContextMenu && event.currentTarget) {
            props.sharedProps.ContextMenu.setAnchor({ x: event.clientX, y: event.clientY });
            props.sharedProps.ContextMenu.setItems(friendContextMenuItems);
            props.sharedProps.ContextMenu.setVisibility(true);
          }
          event.preventDefault();
        }

        return (
        <AvatarTextButton className="FriendButton" showEllipsisConditional iconSrc={friend.friendData?.avatar} onLeftClick={() => { if (props.onFriendClicked) props.onFriendClicked(friend) }} onRightClick={friendRightClickHandler} sharedProps={props.sharedProps}>
          <div className="FriendButtonContainer">
            <Typography>{friend.friendData?.username}#{friend.friendData?.discriminator}</Typography>
            <Typography variant="caption">{friend.status}</Typography>
          </div>
        </AvatarTextButton>)
      })
    }
  })()

  const NoFriendsHint = (() => {
    return (
      <div className="NoChannelsHintContainer">
      <Typography variant="h6">{Localizations_FriendPage("Typography_Heading-NoFriendHint")}</Typography>
      <Typography variant="body1">{Localizations_FriendPage("Typography_Body-NoFriendHint")}</Typography>
    </div>
    )
  })()

  useEffect(() => {
    if (props.sharedProps && props.sharedProps.changeTitleCallback) props.sharedProps.changeTitleCallback(Localizations_FriendPage("PageTitle"));
  }, [Localizations_FriendPage, props, props.sharedProps?.changeTitleCallback]);

  return (
    <PageContainer className={classNames} adaptive={false}>
      {friendElements && friendElements.length > 0 ? friendElements : NoFriendsHint}
    </PageContainer>
  );
}

export default FriendPage;
