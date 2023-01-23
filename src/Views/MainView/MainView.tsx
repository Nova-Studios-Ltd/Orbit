// Global
import React, { useEffect } from "react";
import { useNavigate, useLocation, Outlet, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IconButton, useTheme } from "@mui/material";
import { Add as AddIcon, Group as GroupIcon, Menu as MenuIcon } from "@mui/icons-material";

// Source
import { uCache } from "App";
import { AutoLogin } from "Init/AuthHandler";
import { events } from "Init/WebsocketEventInit";
import { SHA256 } from "Lib/Encryption/Util";
import UserData from "Lib/Storage/Objects/UserData";

// Components
import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";
import ChannelList from "Components/Channels/ChannelList/ChannelList";
import AvatarTextButton from "Components/Buttons/AvatarTextButton/AvatarTextButton";
import GenericHeader from "Components/Headers/GenericHeader/GenericHeader";

// Types
import type { View } from "OldTypes/UI/Components";
import { Routes } from "OldTypes/UI/Routes";
import type { IRawChannelProps } from "OldTypes/API/Interfaces/IRawChannelProps";
import type { IChannelUpdateProps } from "OldTypes/API/Interfaces/IChannelUpdateProps";
import type IUserData from "OldTypes/API/Interfaces/IUserData";
import { IMessageProps } from "OldTypes/API/Interfaces/IMessageProps";
import Friend from "OldTypes/UI/Friend";
import DebugButton from "Components/Buttons/DebugButtom/DebugButton";
import KeyStore from "Lib/Storage/Objects/KeyStore";


interface MainViewProps extends View {
  channels?: IRawChannelProps[],
  messages?: IMessageProps[],
  avatarNonce?: string,
  selectedChannel?: IRawChannelProps,
  channelMenuVisible?: boolean,
  sessionRef?: React.MutableRefObject<string>,
  onNavigateToPage?: (path: Routes) => void,
  setChannelMenuVisibility?: React.Dispatch<React.SetStateAction<boolean>>,
  setChannels?: React.Dispatch<React.SetStateAction<IRawChannelProps[]>>,
  setMessages?: React.Dispatch<React.SetStateAction<IMessageProps[]>>,
  setFriends?: React.Dispatch<React.SetStateAction<Friend[]>>,
  loadChannels?: () => void,
  populateFriendsList?: () => void,
  onChannelClearCache?: (channel: IRawChannelProps) => void,
  onChannelClick?: (channel: IRawChannelProps) => void,
  onChannelDelete?: (channel: IRawChannelProps) => void,
  onChannelEdit?: (channel: IChannelUpdateProps) => void,
  onChannelMenuToggle?: () => void,
  onChannelMove?: (currentChannel: IRawChannelProps, otherChannel: IRawChannelProps, index: number) => void,
  onChannelRemoveRecipient?: (channel: IRawChannelProps, recipient: IUserData) => void,
  onChannelResetIcon?: (channel: IRawChannelProps) => void
}

function MainView(props: MainViewProps) {
  const Localizations_MainView = useTranslation("MainView").t;
  const navigate = useNavigate();
  const location = useLocation();
  const { uuid } = useParams();
  const theme = useTheme();

  const autoNavigate = () => {
    if ((!uuid || uuid.length < 1) && ((location.pathname === Routes.Chat) || (location.pathname === Routes.Root)) && props.channels && props.channels[0]) {
      navigate(`${Routes.Chat}/${props.channels[0].table_Id}`);
    }
    else if ((location.pathname === Routes.Chat) || (location.pathname === Routes.Root)) {
      navigate(Routes.FriendsList);
    }
  }

  useEffect(() => {
    if (!(props.sharedProps && props.sharedProps.widthConstrained) && !props.channelMenuVisible && props.setChannelMenuVisibility) props.setChannelMenuVisibility(true);
  }, [location.pathname, navigate, props, uuid]);

  const onMainViewContainerRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (props.setChannelMenuVisibility && props.sharedProps && props.sharedProps.widthConstrained) {
      props.setChannelMenuVisibility(false);
    }
  }

  useEffect(() => {
    events.on("NewMessage", (message: IMessageProps, channel_uuid: string) => {
      if (props.selectedChannel && props.selectedChannel.table_Id !== channel_uuid) return;
      if (props.setMessages) {
        props.setMessages(prevState => {
          return [message, ...prevState];
        });
      }
      else {
        console.error("setMessages was undefined (MainView)")
      }
    });

    events.on("DeleteMessage", (message: string) => {
      if (props.setMessages) {
        props.setMessages(prevState => {
          const index = prevState.findIndex(e => e.message_Id === message);
          if (index > -1) {
            prevState.splice(index, 1);
          }
          return [...prevState];
        });
      }
      else {
        console.error("setMessages was undefined (MainView)")
      }
    });

    events.on("EditMessage", (message: IMessageProps) => {
      if (props.setMessages) {
        props.setMessages(prevState => {
          const index = prevState.findIndex(e => e.message_Id === message.message_Id);
          if (index > -1) {
            prevState[index] = message;
          }
          return [...prevState];
        });
      }
      else {
        console.error("setMessages was undefined (MainView)")
      }
    });

    events.on("NewChannel", (channel: IRawChannelProps) => {
      if (props.setChannels) {
        props.setChannels(prevState => {
          const index = prevState.findIndex(c => c.table_Id === channel.table_Id);
          if (index > -1) return [...prevState]
          return [...prevState, channel]}
        );
      }
      else {
        console.error("setChannels was undefined (MainView)")
      }
    });

    events.on("DeleteChannel", (channel: string) => {
      if (props.setChannels) {
        props.setChannels(prevState => {
          const index = prevState.findIndex(e => e.table_Id === channel);
          if (index > -1) {
            prevState.splice(index, 1);
          }
          return [...prevState];
        });
        if (props.setMessages) {
          props.setMessages([]);
        }
        else {
          console.error("setMessages was undefined (MainView)")
        }
      }
      else {
        console.error("setChannels was undefined (MainView)")
      }
    });

    events.on("FriendAdded", async (request_uuid: string, status: string) => {
      if (props.setFriends) {
        const friendData = uCache.GetUser(request_uuid);
        props.setFriends(prevState => {
          return [...prevState, {friendData, status} as Friend ];
        });
      }
      else {
        console.error("setFriends was undefined (MainView)")
      }
    });

    events.on("FriendUpdated", async (request_uuid: string, status: string) => {
      if (props.setFriends) {
        const friendData = await uCache.GetUserAsync(request_uuid);
        props.setFriends(prevState => {
          const index = prevState.findIndex(c => c.friendData?.uuid === request_uuid);
          if (index > -1) {
            prevState[index] = {friendData, status} as Friend
          }
          return [...prevState];
        });
      }
      else {
        console.error("setFriends was undefined (MainView)")
      }
    });

    events.on("FriendRemoved", async (request_uuid: string) => {
      if (props.setFriends) {
        props.setFriends(prevState => {
          const index = prevState.findIndex(c => c.friendData?.uuid === request_uuid);
          if (index > -1) {
            prevState.splice(index, 1);
          }
          return [...prevState];
        });
      }
      else {
        console.error("setFriends was undefined (MainView)")
      }
    });

    return (() => {
      events.remove("NewMessage");
      events.remove("DeleteMessage");
      events.remove("EditMessage");
      events.remove("NewChannel");
      events.remove("DeleteChannel");
      events.remove("FriendUpdated")
      events.remove("FriendAdded");
      events.remove("FriendRemoved");
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, props.channels, props.messages]);

  useEffect(() => {
    (async () => {
      if (props.sessionRef) {
        props.sessionRef.current = (await SHA256(Date.now().toString())).Base64;
      }
      else {
        console.error("sessionRef was undefined (MainView)")
      }
    })();

    AutoLogin().then((result: boolean) => {
      if (result) {
        autoNavigate();
      }
      else {
        navigate(Routes.Login);
      }
    });

    if (props.loadChannels) props.loadChannels();
    if (props.populateFriendsList) props.populateFriendsList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ViewContainer>
      <div className="MainViewContainer">
        {
          props.channelMenuVisible ?
          <div className="MainViewContainerLeft">
            <div className="NavigationButtonContainer" style={{ backgroundColor: theme.palette.background.paper, borderColor: theme.palette.divider }}>
              <AvatarTextButton className="NavigationButtonContainerItem" selected={location.pathname === Routes.Dashboard} onLeftClick={() => props.onNavigateToPage ? props.onNavigateToPage(Routes.Dashboard) : null} iconSrc={`${UserData.AvatarSrc}&nonce=${props.avatarNonce || ""}`}>{Localizations_MainView("Typography-SettingsHeader")}</AvatarTextButton>
              <AvatarTextButton className="NavigationButtonContainerItem" iconObj={<GroupIcon />} selected={location.pathname === Routes.FriendsList || location.pathname === Routes.AddFriend || location.pathname === Routes.AddFriendGroup || location.pathname === Routes.BlockedUsersList} onLeftClick={() => props.onNavigateToPage ? props.onNavigateToPage(Routes.FriendsList) : null}>{Localizations_MainView("Typography-FriendsHeader")}</AvatarTextButton>
            </div>
            <div className="MainViewChannelListContainer">
              <GenericHeader className="MainViewHeader" title={Localizations_MainView("Header_Title-ChannelList")} childrenRight={
                <div>
                  <IconButton onClick={() => navigate(Routes.AddFriendGroup)}><AddIcon /></IconButton>
                </div>
              } />
              <ChannelList className="MainViewChannelList" sharedProps={props.sharedProps} channels={props.channels} onChannelClearCache={props.onChannelClearCache} onChannelClick={props.onChannelClick} onChannelEdit={props.onChannelEdit} onChannelDelete={props.onChannelDelete} onChannelMove={props.onChannelMove} onChannelRemoveRecipient={props.onChannelRemoveRecipient} onChannelResetIcon={props.onChannelResetIcon} selectedChannel={props.selectedChannel} />
            </div>
          </div>
        : null}
        <div className="MainViewContainerRight" onClick={onMainViewContainerRightClick} style={{ opacity: props.sharedProps?.widthConstrained && props.channelMenuVisible ? 0.5 : 1 }}>
          <GenericHeader className="MainViewHeader MainViewContainerItem" title={props.sharedProps?.title} childrenLeft={props.sharedProps?.widthConstrained ? <IconButton onClick={(event: React.MouseEvent<HTMLButtonElement>) => { event.stopPropagation(); if (props.onChannelMenuToggle) props.onChannelMenuToggle(); }}><MenuIcon /></IconButton> : null} />
          <Outlet />
        </div>
      </div>
    </ViewContainer>
  );
}

export default MainView;
