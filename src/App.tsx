import React, { useEffect, useRef, useState } from "react";
import { IconButton, Popover, ThemeProvider, Typography. useTheme } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { Route, Routes as RoutingGroup } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { CSSTransition } from "react-transition-group";
import { useLocation, useNavigate } from "react-router-dom";
import { AutoLogin, Logout } from "Init/AuthHandler";
import { Events } from "Init/WebsocketEventInit";
import { Add as AddIcon, Group as GroupIcon, Menu as MenuIcon } from "@mui/icons-material";
import { isValidUsername } from "NSLib/Util";
import { GenerateBase64SHA256 } from "NSLib/NCEncryption";
import { NCChannelCache } from "NSLib/NCChannelCache";
import { FetchImageFromClipboard, NCFile, NotificationType, TriggerNotification, UploadFile } from "NSLib/ElectronAPI";
import { SettingsManager } from "NSLib/SettingsManager";
import { NCUserCache } from "NSLib/NCUserCache";
import { CREATEChannel, DELETEChannel, DELETEMessage, EDITMessage, GETChannel, GETOwnFriends, GETMessages, GETMessagesSingle, GETUserChannels, GETUserUUID, SENDMessage, GETUser, REQUESTFriend, ACCEPTFriend, REMOVEFriend, BLOCKFriend, UNBLOCKFriend, UPDATEChannelName, UPDATEChannelIcon, REMOVEChannelIcon, CREATEGroupChannel, REMOVEChannelMember } from "NSLib/APIEvents";

import { OverrideConsoleLog, OverrideConsoleWarn, OverrideConsoleError, OverrideConsoleSuccess } from "./overrides";
import { GetUrlFlag } from "NSLib/NCFlags";
import { ThemeSelector } from "Theme";
import { Localizations } from "Localization/Localizations";

import AuthView from "Views/AuthView/AuthView";
import ErrorView from "Views/ErrorView/ErrorView";
import MainView from "Views/MainView/MainView";

import LoginPage from "Views/AuthView/Pages/LoginPage/LoginPage";
import RegisterPage from "Views/AuthView/Pages/RegisterPage/RegisterPage";

import { Routes } from "Types/UI/Routes";
import { DebugMessageType } from "Types/Enums";
import type { ReactNode } from "react";
import type { HelpPopupProps, SharedProps } from "Types/UI/Components";
import type { DebugMessage } from "Types/General";
import type { IRawChannelProps } from "Types/API/Interfaces/IRawChannelProps";
import type { IMessageProps } from "Types/API/Interfaces/IMessageProps";
import type { MessageProps } from "Components/Messages/Message/Message";
import { Dictionary } from "NSLib/Dictionary";
import type Friend from "Types/UI/Friend";
import type { IChannelUpdateProps } from "Types/API/Interfaces/IChannelUpdateProps";
import type MessageAttachment from "Types/API/MessageAttachment";
import type IUserData from "Types/API/Interfaces/IUserData";

import "./App.css";

i18n.use(initReactI18next)
.init({
  resources: Localizations,
  lng: "en", // TODO: Remove this and add a language selection system later
  fallbackLng: "en"
});

function App() {
  const Localizations_Common = useTranslation().t;
  const theme = ThemeSelector(GetUrlFlag("theme") || "DarkTheme_Default");
  const navigate = useNavigate();
  const consoleBuffer = useRef([] as DebugMessage[]);

  const location = useLocation();
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
  const [avatarNonce, setAvatarNonce] = useState(Date.now().toString());
  const [widthConstrained, setWidthConstrainedState] = useState(window.matchMedia("(max-width: 600px)").matches);
  const [isTouchCapable, setTouchCapableState] = useState("ontouchstart" in window || navigator.maxTouchPoints > 0);
  const [helpVisible, setHelpVisibility] = useState(false);
  const [helpAnchorEl, setHelpAnchor] = useState(null as unknown as Element);
  const [helpContent, setHelpContent] = useState(null as unknown as ReactNode);
  const [debugConsoleVisible, setDebugConsoleVisibility] = useState(GetUrlFlag("console") ? true : false);
  const [debugConsoleBuffer, setDebugConsoleBuffer] = useState([] as DebugMessage[]);

  const SharedPropsContext = React.createContext({});

  const openConsole = () => setDebugConsoleVisibility(true);

  const closeHelpPopup = () => {
    setHelpVisibility(false);
    setHelpAnchor(null as unknown as Element);
  }

  const HelpPopup: HelpPopupProps = {
    visible: helpVisible,
    anchorEl: helpAnchorEl,
    content: helpContent,
    setVisibility: setHelpVisibility,
    setAnchor: setHelpAnchor,
    setContent: setHelpContent,
    closePopup: closeHelpPopup
  };

  const SharedProps: SharedProps = {
    HelpPopup: HelpPopup,
    widthConstrained: widthConstrained,
    isTouchCapable: isTouchCapable,
    openConsole: openConsole,
    changeTitleCallback: setTitle
  }

  useEffect(() => {
    const onNewDebugMessage = (message: DebugMessage) => {
      consoleBuffer.current = [...consoleBuffer.current, message];
      setDebugConsoleBuffer(consoleBuffer.current);
    }

    // Function overrides

    OverrideConsoleLog(onNewDebugMessage);
    OverrideConsoleWarn(onNewDebugMessage);
    OverrideConsoleError(onNewDebugMessage);
    OverrideConsoleSuccess(onNewDebugMessage);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const consoleMessages = () => {
    if (!debugConsoleVisible) return null;
    return debugConsoleBuffer.map((message) => {
      const messageColor = () => {
        switch (message.type) {
          case DebugMessageType.Log:
            return "primary";
          case DebugMessageType.Warning:
            return "yellow";
          case DebugMessageType.Error:
            return "error";
          case DebugMessageType.Success:
            return "lime";
          default:
            return "primary";
        }
      }

      return (
        <div className="DebugMessage" key={message.timestamp}>
          <Typography variant="caption" fontWeight="bold" color={messageColor()}>[{message.type.toUpperCase()}]</Typography>
          {message.timestamp ? <Typography variant="caption" fontWeight="bold" color="gray">{new Date(message.timestamp).toISOString()}</Typography> : null}
          <Typography variant="caption">{message.message}</Typography>
        </div>
      )
    });
  };

  window.addEventListener("resize", (event) => {
    setWidthConstrainedState(window.matchMedia("(max-width: 600px)").matches);
  });

  // MainView

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

  const channelContainsOwnerUUID = (uuid: string) => {
    for (let i = 0; i < channels.length; i++) {
      const channel = channels[i];
      if (channel.owner_UUID && channel.owner_UUID === uuid) return channel;
    }
    return undefined;
  }

  const loadChannels = async (doNavigate?: boolean) => {
    GETUserChannels(async (channels: string[]) => {
      const loadedChannels = [] as IRawChannelProps[];

      for (var i = 0; i < channels.length; i++) {
        const channel = await GETChannel(channels[i]);
        if (channel === undefined) continue;
        channel.channelIcon = `${channel.channelIcon}&nonce=${avatarNonce}`;
        loadedChannels.push(channel);
      }

      setChannels(loadedChannels);

      if (doNavigate) {
        if (props.path === Routes.Chat && loadedChannels.length < 1) {
          navigate(Routes.Friends);
          return;
        }

        if (props.path === Routes.Chat && loadedChannels[0]) selectChannel(loadedChannels[0]); // Temporary channel preload; TODO: Store last opened channel
      }
    });
  }

  const onAvatarChanged = () => {
    const nonce = Date.now().toString();
    setAvatarNonce(nonce);
  }

  const changeTitleCallbackOverride = (_title: string) => {
    if (props.path !== Routes.Chat && title !== _title) setTitle(_title);
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
    if (props.sharedProps && !props.sharedProps.widthConstrained && !channelMenuOpen) setChannelMenuVisibility(true);
  }, [channelMenuOpen, props, props.sharedProps?.widthConstrained]);

  useEffect(() => {
    if (!props.sharedProps || !props.sharedProps.changeTitleCallback) return;

    if (props.path === Routes.Chat) {
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
    if (messages.length === 0) return;
    const oldestID = parseInt(messages[messages.length - 1].message_Id);
    GETMessages(selectedChannel.table_Id, (messages: IMessageProps[]) => {
      autoScroll.current = false;
      setMessages(prevState => {
        return [...prevState, ...messages];
      })
    }, false, 30, -1, oldestID - 1);
  }

  const onFileUpload = (clipboard?: boolean, event?: React.ClipboardEvent<HTMLInputElement>) => {
    if (clipboard) {
      FetchImageFromClipboard(event).then(async (value: NCFile | string) => {
        if (typeof value === "string") return;
        setMessageAttachments([...MessageAttachments, new MessageAttachment(value.FileContents, value.Filename)]);
      });
      return;
    }
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

  const navigateToPage = (path: Routes) => {
    setSelectedChannel(null as unknown as IRawChannelProps);
    if (props.sharedProps?.widthConstrained) setChannelMenuVisibility(false);
    navigate(path);
  }

  const selectChannel = async (channel: IRawChannelProps) => {
    if (!location.pathname.includes("chat"))
      navigate(`${Routes.Chat}${location.search}`);

    if (channel.channelName) setTitle(channel.channelName);
    if (props.sharedProps?.widthConstrained) setChannelMenuVisibility(false);

    setSelectedChannel(channel);

    if (channel && channel.table_Id) {
      setMessages([]);
      // Check if channel has cache
      const isCache = await NCChannelCache.ContainsCache(channel.table_Id);
      if (isCache !== undefined && !await (isCache as NCChannelCache).IsEmpty()) {
        const cache = isCache as NCChannelCache;
        // Fully refresh cache, ignoring anything, pulling the newest messages
        if (await cache.RequiresRefresh()) {
          console.log("Rebuilding cache...");
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
          console.log("Checking and updating cache...");
          await NCChannelCache.CleanCache(channel.table_Id);
          await NCChannelCache.UpdateCache(channel.table_Id);
          cache.WriteSession(session.current);
          GETMessages(channel.table_Id, (messages: IMessageProps[]) => {
            autoScroll.current = false;
            setMessages([...messages]);
            autoScroll.current = true;
          }, true);
          /*GETMessagesSingle(channel.table_Id, async (message: IMessageProps) => {
            autoScroll.current = false;
            setMessages(prevState => {
              return [...prevState, message];
            });
            return true;
          }, () => {autoScroll.current = true;}, true);*/
          return;
        }

        GETMessages(channel.table_Id, (messages: IMessageProps[]) => {
          autoScroll.current = false;
          setMessages([...messages]);
          autoScroll.current = true;
        });

        /*GETMessagesSingle(channel.table_Id, async (message: IMessageProps) => {
          autoScroll.current = false;
          setMessages(prevState => {
            return [...prevState, message];
          });
          return true;
        }, () => {autoScroll.current = true;});*/
      }
      else {
        GETMessages(channel.table_Id, async (messages: IMessageProps[]) => {
          autoScroll.current = false;
          setMessages([...messages]);
          autoScroll.current = true;
          const cc = await NCChannelCache.ContainsCache(channel.table_Id);
          if (cc) (cc as NCChannelCache).WriteSession(session.current);
        }, true);
      }
    }
  }

  const onFriendClicked = (friend: Friend) => {
    if (friend.friendData && friend.friendData.uuid) {
      switch (friend.status?.toLowerCase()) {
        case "accepted":
          const existingChannel = channelContainsOwnerUUID(friend.friendData.uuid);
          if (existingChannel) {
            selectChannel(existingChannel);
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

  const onCreateGroup = (friends: Friend[]) => {
    console.log(`Requested to create group with recipients ${friends}`);
    if (friends.length > 0) {
      let groupChannelName = "";
      const groupChannelRecipients: string[] = [];
      for (let i = 0; i < friends.length; i++) {
        const friend = friends[i];
        if (friend.friendData) {
          groupChannelName += `${friend.friendData.username}${i < friends.length - 1 ? ", " : ""}`;
          groupChannelRecipients.push(friend.friendData.uuid);
        }
      }

      CREATEGroupChannel(groupChannelName, groupChannelRecipients, (created) => {
        if (created) console.success(`Group channel successfully created`)
        else console.error(`Unable to create group channel`);
      });

      return;
    }
    console.warn(`Unable to create group channel because there were no recipients`);
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

  const onChannelClearCache = (channel: IRawChannelProps) => {
    console.log(`Request to clear channel ${channel.channelName}'s cache`);
    if (channel.table_Id === undefined) return;
    NCChannelCache.DeleteSpecificCache(channel.table_Id).then((success: boolean) => {
      if (!success) console.error(`Failed to clear channel ${channel.table_Id}'s cache`)
      console.success(`Cleared channel ${channel.channelName}'s cache successfully`);
      selectChannel(channel);
    });
  };

  const onChannelEdit = (channel: IChannelUpdateProps) => {
    console.log(`Request to edit channel ${channel.table_Id}`);
    UPDATEChannelName(channel.table_Id, channel.channelName, (result) => { if (result) console.success(`Successfully changed channel ${channel.table_Id}'s name to ${channel.channelName}`); else console.error(`Failed to change channel ${channel.table_Id}'s channel name`) });
    if (channel.channelIcon && channel.channelIcon.FileContents) UPDATEChannelIcon(channel.table_Id, new Blob([channel.channelIcon.FileContents]), (result) => { if (result) console.success(`Successfully changed channel ${channel.table_Id}'s icon`); else console.error(`Failed to change channel ${channel.table_Id}'s channel icon`) });
    loadChannels();
    onAvatarChanged();
  };

  const onChannelDelete = (channel: IRawChannelProps) => {
    console.log(`Request to delete channel ${channel.channelName}`);
    if (channel.table_Id === undefined) return;
    DELETEChannel(channel.table_Id, (deleted: boolean) => {
      console.success(`Request to delete channel ${channel.channelName} successful`);
    });
  };

  const onChannelMove = (currentChannel: IRawChannelProps, otherChannel: IRawChannelProps, index: number) => {
    console.log(`Request to move channel ${otherChannel.channelName} to new index of ${index}`);
    console.warn("Moving channels isn't actually implemented yet");
    // TODO: Add Channel move logic here
  };

  const onChannelRemoveRecipient = (channel: IRawChannelProps, recipient: IUserData) => {
    REMOVEChannelMember(channel.table_Id, recipient.uuid, (removed) => {
      if (removed) console.success(`Successfully removed user ${recipient.username} from the channel ${channel.channelName}`)
      else console.error(`Unable to remove user ${recipient.username} from the channel ${channel.channelName}`);
    });
  }

  const onChannelResetIcon = (channel: IRawChannelProps) => {
    REMOVEChannelIcon(channel.table_Id, (result) => { if (result) console.success(`Successfully reset channel ${channel.table_Id}'s icon`); else console.error(`Failed to reset channel ${channel.table_Id}'s channel icon`) });
  }

  const onMessageEdit = async (message: MessageProps) => {
    console.log(`Request to edit message ${message.id}`);
    if (message.id === undefined) return;
    if (await EDITMessage(selectedChannel.table_Id, message.id, message.content || "")) {
      console.success(`Request to edit message ${message.id} successful`);
    }
  };

  const onMessageDelete = async (message: MessageProps) => {
    if (message.id === undefined) return;
    if (await DELETEMessage(selectedChannel.table_Id, message.id as string)) {
      console.success(`Request to delete message ${message.id} successful`);
    }
  };

  const onLogout = async () => {
    await Logout();
    navigate(Routes.Login);
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
      const friendData = await UserCache.GetUserAsync(request_uuid);
      setFriends(prevState => {
        const index = prevState.findIndex(c => c.friendData?.uuid === request_uuid);
        if (index > -1) {
          prevState[index] = {friendData, status} as Friend
        }
        return [...prevState];
      });
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
      Events.remove("FriendUpdated")
      Events.remove("FriendAdded");
      Events.remove("FriendRemoved");
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channels, messages]);


  useEffect(() => {
    (async () => {
      session.current = (await GenerateBase64SHA256(Date.now().toString())).Base64;
    })();

    AutoLogin().then((result: boolean) => {
      if (!result) navigate(Routes.Login);
    });

    loadChannels(true);
    populateFriendsList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  (window as any).notification = (tile: string, body: string, url: string) => {
    TriggerNotification(title, body, NotificationType.Info, url);
  }

  // MainView End

  return (
    <div className="App" onContextMenu={(event) => event.preventDefault()}>
      <Helmet>
        <title>{title && title.length > 0 ? `${Localizations_Common("AppTitle")} - ${title}` : Localizations_Common("AppTitle")}</title>
      </Helmet>
      <ThemeProvider theme={theme}>
        <SharedPropsContext.Provider value={SharedProps}>
          <RoutingGroup>
            <Route path="*" element={<ErrorView sharedProps={SharedProps} errorCode={404} />}></Route>
            <Route path="/" element={<AuthView sharedProps={SharedProps} page={<LoginPage />} />} />
            <Route path={Routes.Login} element={<AuthView sharedProps={SharedProps} page={<LoginPage />} />} />
            <Route path={Routes.Register} element={<AuthView sharedProps={SharedProps} page={<RegisterPage />} />} />
            <Route path={`${Routes.Chat}/*`} element={<MainView sharedProps={SharedProps} path={Routes.Chat} />} />
            <Route path={Routes.Friends} element={<MainView sharedProps={SharedProps} path={Routes.Friends} />}>
              <Route path={Routes.FriendsList} element={<MainView sharedProps={SharedProps} path={Routes.FriendsList} />} />
              <Route path={Routes.BlockedUsersList} element={<MainView sharedProps={SharedProps} path={Routes.BlockedUsersList} />} />
              <Route path={Routes.AddFriend} element={<MainView sharedProps={SharedProps} path={Routes.AddFriend} />} />
            </Route>
            <Route path={Routes.Settings} element={<MainView sharedProps={SharedProps} path={Routes.Settings} />} />
          </RoutingGroup>
          <Popover className="GenericPopover" open={helpVisible} anchorEl={helpAnchorEl} onClose={() => {
            setHelpAnchor(null as unknown as Element);
            setHelpVisibility(false);
          }}>
            {helpContent}
          </Popover>
          {debugConsoleVisible ? (
          <div className="DebugConsoleContainer" style={{ color: theme.palette.text.primary, background: theme.palette.background.paper }}>
            <div className="DebugConsoleHeader">
              <Typography variant="h5">Debug Console</Typography>
              <IconButton onClick={() => setDebugConsoleVisibility(false)} style={{ marginLeft: "auto" }}><CloseIcon /></IconButton>
            </div>
            <div className="DebugConsole">
              {consoleMessages()}
            </div>
          </div>) : null}
        </SharedPropsContext.Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
