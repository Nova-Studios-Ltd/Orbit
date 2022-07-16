import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AutoLogin, Logout } from "Init/AuthHandler";
import { Events } from "Init/WebsocketEventInit";
import { IconButton, useTheme } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { isValidUsername } from "NSLib/Util";
import { GenerateBase64SHA256 } from "NSLib/NCEncryption";
import { NCChannelCache } from "NSLib/NCChannelCache";
import { UploadFile } from "NSLib/ElectronAPI";
import { SettingsManager } from "NSLib/SettingsManager";
import { NCUserCache } from "NSLib/NCUserCache";
import { CREATEChannel, DELETEChannel, DELETEMessage, EDITMessage, GETChannel, GETOwnFriends, GETMessages, GETMessagesSingle, GETUserChannels, GETUserUUID, SENDMessage, GETUser, REQUESTFriend, ACCEPTFriend, REMOVEFriend, BLOCKFriend, UNBLOCKFriend } from "NSLib/APIEvents";

import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";
import MessageAttachment from "DataTypes/MessageAttachment";
import ChannelList from "Components/Channels/ChannelList/ChannelList";
import AvatarTextButton from "Components/Buttons/AvatarTextButton/AvatarTextButton";
import MessageCanvas from "Components/Messages/MessageCanvas/MessageCanvas";
import GenericHeader from "Components/Headers/GenericHeader/GenericHeader";
import MessageInput, { MessageInputSendEvent } from "Components/Input/MessageInput/MessageInput";
import FriendView from "Views/FriendView/FriendView";
import SettingsView from "Views/SettingsView/SettingsView";

import type { SharedProps, View } from "DataTypes/Components";
import type { IRawChannelProps } from "Interfaces/IRawChannelProps";
import type { IMessageProps } from "Interfaces/IMessageProps";
import type { MessageProps } from "Components/Messages/Message/Message";
import { Dictionary } from "NSLib/Dictionary";
import type Friend from "DataTypes/Friend";
import { AuthViewRoutes, MainViewRoutes, SettingsViewRoutes } from "DataTypes/Routes";

interface MainViewProps extends View {
  path: MainViewRoutes
}

export const UserCache = new NCUserCache();
function MainView(props: MainViewProps) {
  const Localizations_MainView = useTranslation("MainView").t;
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const settings = new SettingsManager();

  const canvasRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const messageCount = useRef(0);
  const session = useRef("");
  const autoScroll = useRef(true);

  const [title, setTitle] = useState("");
  const [channels, setChannels] = useState([] as IRawChannelProps[]);
  const [selectedChannel, setSelectedChannel] = useState(null as unknown as IRawChannelProps);
  const [messages, setMessages] = useState([] as IMessageProps[]);
  const [friends, setFriends] = useState([] as Friend[]);
  const [MessageAttachments, setMessageAttachments] = useState([] as MessageAttachment[]);
  const [channelMenuOpen, setChannelMenuVisibility] = useState(false);
  const [avatarNonce, setAvatarNonce] = useState(Date.now().toString());

  const channelContainsUUID = (uuid: string) => {
    for (let i = 0; i < channels.length; i++) {
      const channel = channels[i];
      const containsUUID = (() => {
        if (channel.members) {
          for (let j = 0; j < channel.members.length; j++) {
            if (channel.members[j] === uuid) return true;
          }
          return false;
        }
        return false;
      })()

      if (containsUUID) return channel;
    }

    return undefined;
  }

  const onAvatarChanged = () => {
    const nonce = Date.now().toString();
    setAvatarNonce(nonce);
  }

  const changeTitleCallbackOverride = (_title: string) => {
    if (props.path !== MainViewRoutes.Chat && title !== _title) setTitle(_title);
  };

  const modifiedSharedProps: SharedProps = {
    ...props.sharedProps,
    changeTitleCallback: changeTitleCallbackOverride
  };

  const scrollCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && autoScroll.current) {
      const distance = canvas.scrollHeight - canvas.scrollTop;
      if (distance < 1200)
        canvas.scroll({ top: canvas.scrollHeight, behavior: "smooth" });
      else
        canvas.scrollTop = canvas.scrollHeight;
    }
    else {
      autoScroll.current = true;
    }
  }

  useEffect(() => {
    if (messageCount.current < messages.length) scrollCanvas();
    messageCount.current = messages.length;
  }, [messages, messages.length]);

  useEffect(() => {
    if (!props.sharedProps || !props.sharedProps.changeTitleCallback) return;

    if (props.path === MainViewRoutes.Chat) {
      props.sharedProps.changeTitleCallback(`@${title}`);
    }
    else {
      props.sharedProps.changeTitleCallback(title);
    }
  }, [props, props.sharedProps?.changeTitleCallback, title]);

  const MessageInputSendHandler = (event: MessageInputSendEvent) => {
    if (selectedChannel === undefined || event.value === undefined || (event.value === "" && MessageAttachments.length === 0)) return;
    SENDMessage(selectedChannel.table_Id, event.value, MessageAttachments, (sent: boolean) => {
      if (sent) {
        setMessageAttachments([] as MessageAttachment[]);
      }
    });
  };

  const onChannelMenuToggle = () => {
    setChannelMenuVisibility(!channelMenuOpen);
  }

  const onLoadPriorMessages = () => {
    //console.log(messages);
    const oldestID = parseInt(messages[messages.length - 1].message_Id); // TODO: Figure out why this spits out an error
    GETMessages(selectedChannel.table_Id, (messages: IMessageProps[]) => {
      autoScroll.current = false;
      setMessages(prevState => {
        return [...prevState, ...messages];
      })
    }, false, 30, -1, oldestID - 1);
  }

  const onFileUpload = () => {
    UploadFile(true).then((files: string | any[]) => {
      const newAttachmentList: MessageAttachment[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        newAttachmentList.push(new MessageAttachment(file.FileContents, file.Filename));
      }

      setMessageAttachments([...MessageAttachments, ...newAttachmentList]);
    });
  };

  const onFileRemove = (id?: string) => {
    if (!id) {
      setMessageAttachments([]);
      return;
    }

    const updatedMessageAttachments = [];
    for (let i = 0; i < MessageAttachments.length; i++) {
      if (MessageAttachments[i].id !== id) {
        updatedMessageAttachments.push(MessageAttachments[i]);
      }
    }

    setMessageAttachments(updatedMessageAttachments);
  };

  const navigateToPage = (path: MainViewRoutes) => {
    setSelectedChannel(null as unknown as IRawChannelProps);
    setChannelMenuVisibility(false);
    navigate(path);
  }

  const onMainViewContainerRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (props.sharedProps && props.sharedProps.widthConstrained) {
      setChannelMenuVisibility(false);
    }
  }

  const onChannelClick = async (channel: IRawChannelProps) => {
    if (!location.pathname.includes("chat"))
      navigate(`${MainViewRoutes.Chat}${location.search}`);

    if (channel.channelName) setTitle(channel.channelName);
    setChannelMenuVisibility(false);

    setSelectedChannel(channel);

    if (channel && channel.table_Id) {
      setMessages([]);
      // Check if channel has cache
      const isCache = await NCChannelCache.ContainsCache(channel.table_Id);
      if (isCache !== undefined) {
        const cache = isCache as NCChannelCache;
        // Fully refresh cache, ignoring anything, pulling the newest messages
        if (await cache.RequiresRefresh()) {
          //cache.ClearCache();
          GETMessagesSingle(channel.table_Id, async (message: IMessageProps) => {
            autoScroll.current = false;
            await cache.SetMessage(message.author_UUID, message);
            setMessages(prevState => {
              return [...prevState, message];
            });
            return true;
          }, () => {autoScroll.current = true;}, true);
          cache.WriteSession(session.current);
          return;
        }

        if (!await cache.IsValidSession(session.current)) {
          await NCChannelCache.CleanCache(channel.table_Id);
          await NCChannelCache.UpdateCache(channel.table_Id);
          cache.WriteSession(session.current);
          GETMessagesSingle(channel.table_Id, async (message: IMessageProps) => {
            autoScroll.current = false;
            setMessages(prevState => {
              return [...prevState, message];
            });
            return true;
          }, () => {autoScroll.current = true;}, true);
          return;
        }
        GETMessagesSingle(channel.table_Id, async (message: IMessageProps) => {
          autoScroll.current = false;
          setMessages(prevState => {
            return [...prevState, message];
          });
          return true;
        }, () => {autoScroll.current = true;});
      }
      else {
        GETMessagesSingle(channel.table_Id, async (message: IMessageProps) => {
          autoScroll.current = false;
          setMessages(prevState => {
            return [...prevState, message];
          });
          return true;
        }, async () => {
          autoScroll.current = true;
          const cc = await NCChannelCache.ContainsCache(channel.table_Id);
          if (cc) (cc as NCChannelCache).WriteSession(session.current);
        });
      }
    }
  }

  const onFriendClicked = (friend: Friend) => {
    if (friend.friendData && friend.friendData.uuid) {
      switch (friend.status?.toLowerCase()) {
        case "accepted":
          const existingChannel = channelContainsUUID(friend.friendData.uuid);
          if (existingChannel) {
            onChannelClick(existingChannel);
          }
          else {
            CREATEChannel(friend.friendData.uuid, (status) => { console.log(`Channel creation from onFriendClicked status: ${status}`) });
          }
          break;
        case "request":
          ACCEPTFriend(friend.friendData.uuid);
          break;
      }
    }
  }

  const onAddFriend = async (recipient: string) => {
    if (isValidUsername(recipient)) {
      const ud = recipient.split("#");
      const user = await GETUserUUID(ud[0], ud[1]);
      if (user === undefined) return;
      REQUESTFriend(user);
    }
  };

  const onBlockFriend = (uuid: string) => {
    BLOCKFriend(uuid);
    console.log(`Pseudocockblocked user ${uuid}`);
  }

  const onUnblockFriend = (uuid: string) => {
    UNBLOCKFriend(uuid);
    console.log(`Pseudouncockblocked user ${uuid}`);
  }

  const onRemoveFriend = (uuid: string) => {
    REMOVEFriend(uuid);
  }

  const onChannelEdit = (channel: IRawChannelProps) => {
    console.log(`Request to edit channel ${channel.channelName}`);
    // TODO: Add Channel edit logic here
  };

  const onChannelDelete = (channel: IRawChannelProps) => {
    console.log(`Request to delete channel ${channel.channelName}`);
    if (channel.table_Id === undefined) return;
    DELETEChannel(channel.table_Id, (deleted: boolean) => {
      console.log(`Request to delete channel ${channel.table_Id} successful`);
    });
  };

  const onMessageEdit = async (message: MessageProps) => {
    console.log(`Request to edit message ${message.id}. New Message: ${message.content}`);
    if (message.id === undefined) return;
    if (await EDITMessage(selectedChannel.table_Id, message.id, message.content || "")) {
      console.log(`Request to edit message ${message.id} successful`);
    }
  };

  const onMessageDelete = async (message: MessageProps) => {
    if (message.id === undefined) return;
    if (await DELETEMessage(selectedChannel.table_Id, message.id as string)) {
      console.log(`Request to delete message ${message.id} successful`);
    }
  };

  const onLogout = async () => {
    await Logout();
    navigate(AuthViewRoutes.Login);
  }

  const populateFriendsList = async () => {
    const rawFriends: Dictionary<string> = await GETOwnFriends();
    const newFriendsArray: Friend[] = [];

    for (let i = 0; i < rawFriends.keys().length; i++) {
      const friendUUID = rawFriends.keys()[i];
      const friendStatus = rawFriends.getValue(friendUUID);

      const friendData = await GETUser(friendUUID);
      newFriendsArray.push({ friendData, status: friendStatus });
    }

    setFriends(newFriendsArray);
  }

  useEffect(() => {
    Events.on("NewMessage", (message: IMessageProps, channel_uuid: string) => {
      if (selectedChannel.table_Id !== channel_uuid) return;
      setMessages(prevState => {
        return [message, ...prevState];
      });
    });

    Events.on("DeleteMessage", (message: string) => {
      setMessages(prevState => {
        const index = prevState.findIndex(e => e.message_Id === message);
        if (index > -1) {
          prevState.splice(index, 1);
        }
        return [...prevState];
      });
    });

    Events.on("EditMessage", (message: IMessageProps) => {
      setMessages(prevState => {
        const index = prevState.findIndex(e => e.message_Id === message.message_Id);
        if (index > -1) {
          prevState[index] = message;
        }
        return [...prevState];
      });
    });

    Events.on("NewChannel", (channel: IRawChannelProps) => {
      setChannels(prevState => {
        const index = prevState.findIndex(c => c.table_Id === channel.table_Id);
        if (index > -1) return [...prevState]
        return [...prevState, channel]}
      );
    });

    Events.on("DeleteChannel", (channel: string) => {
      setChannels(prevState => {
        const index = prevState.findIndex(e => e.table_Id === channel);
        if (index > -1) {
          prevState.splice(index, 1);
        }
        return [...prevState];
      });
      setMessages([]);
    });

    Events.on("FriendAdded", async (request_uuid: string, status: string) => {
      const friendData = UserCache.GetUser(request_uuid);
      setFriends(prevState => {
        return [...prevState, {friendData, status} as Friend ];
      });
    });

    Events.on("FriendUpdated", async (request_uuid: string, status: string) => {
      const friendData = UserCache.GetUser(request_uuid);
      setFriends(prevState => {
        const index = prevState.findIndex(c => c.friendData?.uuid === request_uuid);
        if (index > -1) {
          prevState[index] = {friendData, status} as Friend
        }
        return [...prevState];
      })
    });

    Events.on("FriendRemoved", async (request_uuid: string) => {
      setFriends(prevState => {
        const index = prevState.findIndex(c => c.friendData?.uuid === request_uuid);
        if (index > -1) {
          prevState.splice(index, 1);
        }
        return [...prevState];
      });
    });

    return (() => {
      Events.remove("NewMessage");
      Events.remove("DeleteMessage");
      Events.remove("EditMessage");
      Events.remove("NewChannel");
      Events.remove("DeleteChannel");
      Events.remove("FriendAdded");
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channels, messages]);


  useEffect(() => {
    (async () => {
      session.current = (await GenerateBase64SHA256(Date.now().toString())).Base64;
    })();

    AutoLogin().then((result: boolean) => {
      if (!result) navigate(AuthViewRoutes.Login);
    });

    GETUserChannels(async (channels: string[]) => {
      const loadedChannels = [] as IRawChannelProps[];

      for (var i = 0; i < channels.length; i++) {
        const channel = await GETChannel(channels[i]);
        if (channel === undefined) continue;
        loadedChannels.push(channel);
      }

      setChannels(loadedChannels);

      if (props.path === MainViewRoutes.Chat && loadedChannels.length < 1) {
        navigate(MainViewRoutes.Friends);
        return;
      }

      if (props.path === MainViewRoutes.Chat && loadedChannels[0]) onChannelClick(loadedChannels[0]); // Temporary channel preload
    });

    populateFriendsList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const page = () => {
    switch (props.path) {
      case MainViewRoutes.Chat:
        return (
          <>
            <MessageCanvas className="MainViewContainerItem" sharedProps={props.sharedProps} canvasRef={canvasRef} messages={messages} onMessageEdit={onMessageEdit} onMessageDelete={onMessageDelete} onLoadPriorMessages={onLoadPriorMessages} />
            <MessageInput className="MainViewContainerItem" sharedProps={props.sharedProps} attachments={MessageAttachments} onFileRemove={onFileRemove} onFileUpload={onFileUpload} onSend={MessageInputSendHandler} />
          </>
        )
      case MainViewRoutes.Friends:
        return (<FriendView sharedProps={modifiedSharedProps} friends={friends} onReloadList={populateFriendsList} onFriendClicked={onFriendClicked} onAddFriend={onAddFriend} onBlockFriend={onBlockFriend} onUnblockFriend={onUnblockFriend} onRemoveFriend={onRemoveFriend} />);
      case MainViewRoutes.Settings:
        return (<SettingsView sharedProps={modifiedSharedProps} avatarNonce={avatarNonce} onAvatarChanged={onAvatarChanged} onLogout={onLogout} path={SettingsViewRoutes.Dashboard} />);
      default:
        console.warn("[MainView] Invalid Page");
        return null;
    }
  }

  const MainViewContainerLeft = () => {
    if (props.sharedProps && props.sharedProps.widthConstrained && !channelMenuOpen) return null;

    return (
      <div className="MainViewContainerLeft">
        <div className="NavigationButtonContainer" style={{ backgroundColor: theme.palette.background.paper, borderColor: theme.palette.divider }}>
          <AvatarTextButton className="NavigationButtonContainerItem" selected={props.path === MainViewRoutes.Settings} onLeftClick={() => navigateToPage(MainViewRoutes.Settings)} iconSrc={`${settings.User.avatarSrc}&nonce=${avatarNonce}`}>{Localizations_MainView("Typography-SettingsHeader")}</AvatarTextButton>
          <AvatarTextButton className="NavigationButtonContainerItem" selected={props.path === MainViewRoutes.Friends} onLeftClick={() => navigateToPage(MainViewRoutes.Friends)}>{Localizations_MainView("Typography-FriendsHeader")}</AvatarTextButton>
        </div>
        <ChannelList sharedProps={props.sharedProps} channels={channels} onChannelEdit={onChannelEdit} onChannelDelete={onChannelDelete} onChannelClick={onChannelClick} selectedChannel={selectedChannel} />
      </div>
    );
  }

  return (
    <ViewContainer>
      <div className="MainViewContainer">
        {MainViewContainerLeft()}
        <div className="MainViewContainerRight" onClick={onMainViewContainerRightClick} style={{ opacity: channelMenuOpen ? 0.5 : 1 }}>
          <GenericHeader sharedProps={props.sharedProps} title={title} childrenLeft={props.sharedProps?.widthConstrained ? <IconButton onClick={(event: React.MouseEvent<HTMLButtonElement>) => { event.stopPropagation(); onChannelMenuToggle(); }}><MenuIcon /></IconButton> : null} />
          {page()}
        </div>
      </div>
    </ViewContainer>
  );
}

export default MainView;
