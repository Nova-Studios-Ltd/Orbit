import React, { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AutoLogin, Logout } from "Init/AuthHandler";
import { Events } from "Init/WebsocketEventInit";
import { IconButton, useTheme } from "@mui/material";
import { Add as AddIcon, Group as GroupIcon, Menu as MenuIcon } from "@mui/icons-material";
import { isValidUsername } from "NSLib/Util";
import { GenerateBase64SHA256 } from "NSLib/NCEncryption";
import { NCChannelCache } from "NSLib/NCChannelCache";
import { FetchImageFromClipboard, NCFile, NotificationType, TriggerNotification, UploadFile } from "NSLib/ElectronAPI";
import { SettingsManager } from "NSLib/SettingsManager";
import { NCUserCache } from "NSLib/NCUserCache";
import { CREATEChannel, DELETEChannel, DELETEMessage, EDITMessage, GETChannel, GETOwnFriends, GETMessages, GETMessagesSingle, GETUserChannels, GETUserUUID, SENDMessage, GETUser, REQUESTFriend, ACCEPTFriend, REMOVEFriend, BLOCKFriend, UNBLOCKFriend, UPDATEChannelName, UPDATEChannelIcon, REMOVEChannelIcon, CREATEGroupChannel, REMOVEChannelMember } from "NSLib/APIEvents";

import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";
import MessageAttachment from "Types/API/MessageAttachment";
import ChannelList from "Components/Channels/ChannelList/ChannelList";
import AvatarTextButton from "Components/Buttons/AvatarTextButton/AvatarTextButton";
import MessageCanvas from "Components/Messages/MessageCanvas/MessageCanvas";
import GenericHeader from "Components/Headers/GenericHeader/GenericHeader";
import MessageInput, { MessageInputSendEvent } from "Components/Input/MessageInput/MessageInput";
import FriendView from "Views/FriendView/FriendView";
import SettingsView from "Views/SettingsView/SettingsView";

import type { SharedProps, View } from "Types/UI/Components";
import type { IRawChannelProps } from "Types/API/Interfaces/IRawChannelProps";
import type { IMessageProps } from "Types/API/Interfaces/IMessageProps";
import type { MessageProps } from "Components/Messages/Message/Message";
import { Dictionary } from "NSLib/Dictionary";
import type Friend from "Types/UI/Friend";
import { Routes } from "Types/UI/Routes";
import type { IChannelUpdateProps } from "Types/API/Interfaces/IChannelUpdateProps";
import IUserData from "Types/API/Interfaces/IUserData";
import { URLGetChannelUUID } from "NSLib/LibURL";

interface MainViewProps extends View {
  path: Routes | Routes | Routes
}

export const UserCache = new NCUserCache();
function MainView(props: MainViewProps) {
  const Localizations_MainView = useTranslation("MainView").t;
  const navigate = useNavigate();
  const theme = useTheme();
  const settings = new SettingsManager();

  const [channelMenuVisible, setChannelMenuVisibility] = useState(false);

  const onMainViewContainerRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (props.sharedProps && props.sharedProps.widthConstrained) {
      setChannelMenuVisibility(false);
    }
  }

  const page = () => {
    switch (props.path) {
      case Routes.Chat:
        return (
          <>
            <MessageCanvas className="MainViewContainerItem" sharedProps={props.sharedProps} canvasRef={canvasRef} messages={messages} onMessageEdit={onMessageEdit} onMessageDelete={onMessageDelete} onLoadPriorMessages={onLoadPriorMessages} />
            <MessageInput className="MainViewContainerItem" sharedProps={props.sharedProps} attachments={MessageAttachments} onFileRemove={onFileRemove} onFileUpload={onFileUpload} onSend={MessageInputSendHandler} />
          </>
        )
      case Routes.Friends:
        return (<FriendView sharedProps={modifiedSharedProps} friends={friends} onReloadList={populateFriendsList} onFriendClicked={onFriendClicked} onAddFriend={onAddFriend} onCreateGroup={onCreateGroup} onBlockFriend={onBlockFriend} onUnblockFriend={onUnblockFriend} onRemoveFriend={onRemoveFriend} />);
      case Routes.Settings:
        return (<SettingsView sharedProps={modifiedSharedProps} avatarNonce={avatarNonce} onAvatarChanged={onAvatarChanged} onLogout={onLogout} path={Routes.Dashboard} />);
      default:
        console.warn("[MainView] Invalid Page");
        return null;
    }
  }

  const MainViewContainerLeft = () => {
    //if (props.sharedProps && props.sharedProps.widthConstrained && !channelMenuOpen) return null;

    return (
      <CSSTransition classNames="MainViewContainerLeft" in={channelMenuVisible} timeout={10}>
        <div className="MainViewContainerLeft">
          <div className="NavigationButtonContainer" style={{ backgroundColor: theme.palette.background.paper, borderColor: theme.palette.divider }}>
            <AvatarTextButton className="NavigationButtonContainerItem" selected={props.path === Routes.Settings} onLeftClick={() => navigateToPage(Routes.Settings)} iconSrc={`${settings.User.avatarSrc}&nonce=${avatarNonce}`}>{Localizations_MainView("Typography-SettingsHeader")}</AvatarTextButton>
            <AvatarTextButton className="NavigationButtonContainerItem" iconObj={<GroupIcon />} selected={props.path === Routes.Friends} onLeftClick={() => navigateToPage(Routes.Friends)}>{Localizations_MainView("Typography-FriendsHeader")}</AvatarTextButton>
          </div>
          <div className="MainViewChannelListContainer">
            <GenericHeader className="MainViewHeader" title={Localizations_MainView("Header_Title-ChannelList")} childrenRight={
              <div>
                <IconButton onClick={() => navigate(Routes.Friends)}><AddIcon /></IconButton>
              </div>
            } />
            <ChannelList className="MainViewChannelList" sharedProps={props.sharedProps} channels={channels} onChannelClearCache={onChannelClearCache} onChannelClick={selectChannel} onChannelEdit={onChannelEdit} onChannelDelete={onChannelDelete} onChannelMove={onChannelMove} onChannelRemoveRecipient={onChannelRemoveRecipient} onChannelResetIcon={onChannelResetIcon} selectedChannel={selectedChannel} />
          </div>
        </div>
      </CSSTransition>
    );
  }

  return (
    <ViewContainer>
      <div className="MainViewContainer">
        {MainViewContainerLeft()}
        <div className="MainViewContainerRight" onClick={onMainViewContainerRightClick} style={{ opacity: props.sharedProps?.widthConstrained && channelMenuVisible ? 0.5 : 1 }}>
          <GenericHeader className="MainViewHeader MainViewContainerItem" sharedProps={props.sharedProps} title={props.title} childrenLeft={props.sharedProps?.widthConstrained ? <IconButton onClick={(event: React.MouseEvent<HTMLButtonElement>) => { event.stopPropagation(); onChannelMenuToggle(); }}><MenuIcon /></IconButton> : null} />
          {page()}
        </div>
      </div>
    </ViewContainer>
  );
}

export default MainView;
