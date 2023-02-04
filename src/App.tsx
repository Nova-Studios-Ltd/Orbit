// Global
import React, { useEffect, useRef, useState } from "react";
import { IconButton, Popover, ThemeProvider, Typography, useTheme } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { Route, Routes as RoutingGroup } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

// Source
import { Logout } from "Init/AuthHandler";
import { OverrideConsoleLog, OverrideConsoleWarn, OverrideConsoleError, OverrideConsoleSuccess, DummyConsoleSuccess } from "./overrides";
import { Localizations } from "Localization/Localizations";
import { UserCache } from "Lib/Storage/Objects/UserCache";
import { Flags, HasUrlFlag } from "Lib/Debug/Flags";
import { RequestUser, RequestUserChannels, RequestUserUUID } from "Lib/API/Endpoints/User";
import { RequestChannel, RequestCreateChannel, RequestCreateGroup, RequestDeleteChannel, RequestRemoveMember, RequestResetChannelIcon, RequestUpdateChannelIcon, RequestUpdateChannelName } from "Lib/API/Endpoints/Channels";
import { RequestDeleteMessage, RequestEditMessage, RequestMessages, SendMessage } from "Lib/API/Endpoints/Messages";
import { FetchImageFromClipboard, NCFile, UploadFile } from "Lib/ElectronAPI";
import NSPerformace from "Lib/Debug/NSPerformace";
import { ChannelCache } from "Lib/Storage/Objects/ChannelCache";
import { IsValidUsername } from "Lib/Utility/Utility";
import { RequestBlockFriend, RequestRemoveFriend, RequestUnblockFriend, RequestUserFriends, SendAcceptFriend, SendFriendRequest } from "Lib/API/Endpoints/Friends";

// Components
import AuthView from "Views/AuthView/AuthView";
import ErrorView from "Views/ErrorView/ErrorView";
import FriendView from "Views/FriendView/FriendView";
import MainView from "Views/MainView/MainView";
import SettingsView from "Views/SettingsView/SettingsView";

import AddFriendsPage from "Views/FriendView/Pages/AddFriendsPage/AddFriendsPage";
import BlockedUsersPage from "Views/FriendView/Pages/BlockedUsersPage/BlockedUsersPage";
import ChatPage from "Views/MainView/Pages/ChatPage/ChatPage";
import DashboardPage from "Views/SettingsView/Pages/DashboardPage/DashboardPage";
import FriendPage from "Views/FriendView/Pages/FriendPage/FriendPage";
import LoginPage from "Views/AuthView/Pages/LoginPage/LoginPage";
import RegisterPage from "Views/AuthView/Pages/RegisterPage/RegisterPage";
import ResetPage from "Views/AuthView/Pages/ResetPage/ResetPage";
import RequestResetPage from "Views/AuthView/Pages/ResetPage/RequestResetPage";
import ConfirmPage from "Views/AuthView/Pages/ConfirmPage/ConfirmPage";

// Types
import { Routes } from "Types/UI/Routes";
import { ChannelTypes, DebugMessageType } from "Types/Enums";
import type { HelpPopupProps, SharedProps } from "Types/UI/Components";
import type { DebugMessage } from "Types/General";
import type { IRawChannelProps } from "Types/API/Interfaces/IRawChannelProps";
import type { IMessageProps } from "Types/API/Interfaces/IMessageProps";
import type { MessageProps } from "Components/Messages/Message/Message";
import type { MessageInputSendEvent } from "Components/Input/MessageInput/MessageInput";
import { Dictionary } from "Lib/Objects/Dictionary";
import type Friend from "Types/UI/Friend";
import type { IChannelUpdateProps } from "Types/API/Interfaces/IChannelUpdateProps";
import MessageAttachment from "Types/API/MessageAttachment";
import type IUserData from "Types/API/Interfaces/IUserData";

import "./App.css";

// Debug
import { API_DOMAIN, DEBUG, IsDevelopment, WEBSOCKET_DOMAIN } from "vars";
import { ThemeEngine } from "Lib/CustomizationEngines/Theming/ThemeEngine";



i18n.use(initReactI18next)
.init({
  resources: Localizations,
  lng: "en", // TODO: Remove this and add a language selection system later
  fallbackLng: "en",
  returnNull: false,
});

export const uCache = new UserCache();

function App() {
  const Localizations_Common = useTranslation().t;
  const navigate = useNavigate();
  const location = useLocation();

  const isTouchCapable = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const consoleBuffer = useRef([] as DebugMessage[]);
  const canvasRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const messageCount = useRef(0);
  const session = useRef("");
  const autoScroll = useRef(true);

  const [title, setTitle] = useState("");
  const [channelMenuVisible, setChannelMenuVisibility] = useState(false);
  const [channels, setChannels] = useState([] as IRawChannelProps[]);
  const [selectedChannel, setSelectedChannel] = useState(null as unknown as IRawChannelProps);
  const [messages, setMessages] = useState([] as IMessageProps[]);
  const [friends, setFriends] = useState([] as Friend[]);
  const [MessageAttachments, setMessageAttachments] = useState([] as MessageAttachment[]);
  const [avatarNonce, setAvatarNonce] = useState(Date.now().toString());
  const [widthConstrained, setWidthConstrainedState] = useState(window.matchMedia("(max-width: 600px)").matches);
  const [helpVisible, setHelpVisibility] = useState(false);
  const [helpAnchorEl, setHelpAnchor] = useState(null as unknown as Element);
  const [helpContent, setHelpContent] = useState(null as unknown as ReactNode);
  const [debugConsoleVisible, setDebugConsoleVisibility] = useState(HasUrlFlag(Flags.EnableConsole));
  const [debugConsoleBuffer, setDebugConsoleBuffer] = useState([] as DebugMessage[]);

  // Theming
  const [cTheme, setTheme] = useState("");
  const theme = useTheme();

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
    widthConstrained: widthConstrained,
    isTouchCapable: isTouchCapable,
    title: title,
    HelpPopup: HelpPopup,
    openConsole: openConsole,
    changeTitleCallback: setTitle
  }


  useEffect(() => {
    const onNewDebugMessage = (message: DebugMessage) => {
      consoleBuffer.current = [...consoleBuffer.current, message];
      setDebugConsoleBuffer(consoleBuffer.current);
    }

    (async () => {
      await ThemeEngine.LoadThemesFromURL(`${window.location.origin}/Themes/`);
      const lastTheme = localStorage.getItem("Theme");
      if (lastTheme === null) {
        localStorage.setItem("Theme", "DarkTheme_Default");
        setTheme("DarkTheme_Default");
      }
      else {
        setTheme(lastTheme);
      }
    })();

    // Function overrides

    if (DEBUG) {
      OverrideConsoleLog(onNewDebugMessage);
      OverrideConsoleWarn(onNewDebugMessage);
      OverrideConsoleError(onNewDebugMessage);
      OverrideConsoleSuccess(onNewDebugMessage);
    }
    else {
      console.warn("Not overriding console logging because debug mode is disabled. Change this in vars.ts.");
      DummyConsoleSuccess();
    }

    // Show message in console indicating we are using a development branch
    if (IsDevelopment) {
      console.warn(`Client is in development mode; API: ${API_DOMAIN}; WEBSOCKET: ${WEBSOCKET_DOMAIN}`);
    }

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

  const channelContainsUUID = (uuid: string, noGroup?: boolean) => {
    for (let i = 0; i < channels.length; i++) {
      const channel = channels[i];

      if (noGroup && (channel.channelType !== ChannelTypes.DMChannel)) continue;

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

  const loadChannels = async () => {
    RequestUserChannels(async (channels: string[]) => {
      const loadedChannels = [] as IRawChannelProps[];

      for (var i = 0; i < channels.length; i++) {
        const channel = await RequestChannel(channels[i]);
        if (channel === undefined) continue;
        channel.channelIcon = `${channel.channelIcon}&nonce=${avatarNonce}`;
        loadedChannels.push(channel);
      }

      setChannels(loadedChannels);
    });
  }

  const onAvatarChanged = () => {
    const nonce = Date.now().toString();
    setAvatarNonce(nonce);
  }

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

  const onMessageInputSubmit = (event: MessageInputSendEvent) => {
    if (selectedChannel === undefined || event.value === undefined || (event.value === "" && MessageAttachments.length === 0)) return;
    SendMessage(selectedChannel.table_Id, event.value, MessageAttachments, (sent: boolean) => {
      if (sent) {
        setMessageAttachments([] as MessageAttachment[]);
      }
    });
  };

  const onChannelMenuToggle = () => {
    setChannelMenuVisibility(!channelMenuVisible);
  }

  const onLoadPriorMessages = () => {
    if (messages.length === 0) return;
    const oldestID = parseInt(messages[messages.length - 1].message_Id);
    RequestMessages(selectedChannel.table_Id, (messages: IMessageProps[]) => {
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

  const onMainViewNavigateToPage = (path: Routes) => {
    setSelectedChannel(null as unknown as IRawChannelProps);
    if (widthConstrained) setChannelMenuVisibility(false);
    navigate(`${path}${location.search}`);
  }

  const selectChannel = async (channel: IRawChannelProps) => {
    if (selectedChannel && channel.table_Id === selectedChannel.table_Id) return;

    navigate(`${Routes.Chat}/${channel.table_Id}${location.search}`);

    if (channel.channelName) setTitle(channel.channelName);
    if (widthConstrained) setChannelMenuVisibility(false);

    setSelectedChannel(channel);

    if (channel !== undefined && channel.table_Id) {
      setMessages([]);
      const perf = new NSPerformace("ChannelLoad");


      // Check for channel cache
      const isCache = await ChannelCache.ContainsCache(channel.table_Id);
      if (isCache !== undefined && !await (isCache as ChannelCache).IsEmpty()) {
        const cache = isCache as ChannelCache;

        // Load current messages while we wait for the API request to finish
        setMessages((await cache.GetMessages(30)).Messages);
        scrollCanvas();

        // Check cache
        if (await cache.ReadSession() !== session.current) {
          RequestMessages(channel.table_Id, async (messages: IMessageProps[]) => {
            autoScroll.current = false;
            const perf = new NSPerformace("SetMessagesState");
            setMessages([...messages]);
            perf.Stop();
            autoScroll.current = true;
            scrollCanvas();
            cache.WriteSession(session.current);
          }, true);
        }
      }
      else {
        const cache = isCache as ChannelCache;
        RequestMessages(channel.table_Id, async (messages: IMessageProps[]) => {
          autoScroll.current = false;
          setMessages([...messages]);
          autoScroll.current = true;
          scrollCanvas();
          cache.WriteSession(session.current);
        }, true);
      }
      perf.Stop();
    }
  }

  const onFriendClicked = (friend: Friend) => {
    if (friend.friendData && friend.friendData.uuid) {
      switch (friend.status?.toLowerCase()) {
        case "accepted":
          const existingChannel = channelContainsUUID(friend.friendData.uuid, true);
          if (existingChannel) {
            selectChannel(existingChannel);
          }
          else {
            RequestCreateChannel(friend.friendData.uuid, (status) => { console.log(`Channel creation from onFriendClicked status: ${status}`) });
          }
          break;
        case "request":
          SendAcceptFriend(friend.friendData.uuid);
          break;
      }
    }
  }

  const onCreateGroup = (friends: Friend[]) => {
    navigate(`${Routes.FriendsList}${location.search}`);

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

      RequestCreateGroup(groupChannelName, groupChannelRecipients, (created) => {
        if (created) console.success(`Group channel successfully created`)
        else console.error(`Unable to create group channel`);
      });

      return;
    }
    console.warn(`Unable to create group channel because there were no recipients`);
  }

  const onAddFriend = async (recipient: string) => {
    if (IsValidUsername(recipient)) {
      const ud = recipient.split("#");
      const user = await RequestUserUUID(ud[0], ud[1]);
      if (user === undefined) return 1;
      SendFriendRequest(user);
      return 0;
    }
    return 2;
  };

  const onBlockFriend = (uuid: string) => {
    RequestBlockFriend(uuid);
    console.log(`Pseudocockblocked user ${uuid}`);
  }

  const onUnblockFriend = (uuid: string) => {
    RequestUnblockFriend(uuid);
    console.log(`Pseudouncockblocked user ${uuid}`);
  }

  const onRemoveFriend = (uuid: string) => {
    RequestRemoveFriend(uuid);
  }

  const onChannelClearCache = (channel: IRawChannelProps) => {
    console.log(`Request to clear channel ${channel.channelName}'s cache`);
    if (channel.table_Id === undefined) return;
    ChannelCache.DeleteSpecificCache(channel.table_Id).then((success: boolean) => {
      if (!success) console.error(`Failed to clear channel ${channel.table_Id}'s cache`)
      console.success(`Cleared channel ${channel.channelName}'s cache successfully`);
      selectChannel(channel);
    });
  };

  const onChannelEdit = (channel: IChannelUpdateProps) => {
    console.log(`Request to edit channel ${channel.table_Id}`);
    RequestUpdateChannelName(channel.table_Id, channel.channelName, (result) => { if (result) console.success(`Successfully changed channel ${channel.table_Id}'s name to ${channel.channelName}`); else console.error(`Failed to change channel ${channel.table_Id}'s channel name`) });
    if (channel.channelIcon && channel.channelIcon.FileContents) RequestUpdateChannelIcon(channel.table_Id, new Blob([channel.channelIcon.FileContents]), (result) => { if (result) console.success(`Successfully changed channel ${channel.table_Id}'s icon`); else console.error(`Failed to change channel ${channel.table_Id}'s channel icon`) });
    loadChannels();
    onAvatarChanged();
  };

  const onChannelDelete = (channel: IRawChannelProps) => {
    console.log(`Request to delete channel ${channel.channelName}`);
    if (channel.table_Id === undefined) return;
    RequestDeleteChannel(channel.table_Id, (deleted: boolean) => {
      console.success(`Request to delete channel ${channel.channelName} successful`);
    });
  };

  const onChannelMove = (currentChannel: IRawChannelProps, otherChannel: IRawChannelProps, index: number) => {
    console.log(`Request to move channel ${otherChannel.channelName} to new index of ${index}`);
    console.warn("Moving channels isn't actually implemented yet");
    // TODO: Add Channel move logic here
  };

  const onChannelRemoveRecipient = (channel: IRawChannelProps, recipient: IUserData) => {
    RequestRemoveMember(channel.table_Id, recipient.uuid, (removed) => {
      if (removed) console.success(`Successfully removed user ${recipient.username} from the channel ${channel.channelName}`)
      else console.error(`Unable to remove user ${recipient.username} from the channel ${channel.channelName}`);
    });
  }

  const onChannelResetIcon = (channel: IRawChannelProps) => {
    RequestResetChannelIcon(channel.table_Id, (result) => { if (result) console.success(`Successfully reset channel ${channel.table_Id}'s icon`); else console.error(`Failed to reset channel ${channel.table_Id}'s channel icon`) });
  }

  const onMessageEdit = async (message: MessageProps) => {
    console.log(`Request to edit message ${message.id}`);
    if (message.id === undefined) return;
    if (await RequestEditMessage(selectedChannel.table_Id, message.id, message.content || "")) {
      console.success(`Request to edit message ${message.id} successful`);
    }
  };

  const onMessageDelete = async (message: MessageProps) => {
    if (message.id === undefined) return;
    if (await RequestDeleteMessage(selectedChannel.table_Id, message.id as string)) {
      console.success(`Request to delete message ${message.id} successful`);
    }
  };

  const onLogout = async () => {
    await Logout();
    navigate(Routes.Login);
  }

  const populateFriendsList = async () => {
    const rawFriends: Dictionary<string, string> = await RequestUserFriends();
    const newFriendsArray: Friend[] = [];

    for (let i = 0; i < rawFriends.keys().length; i++) {
      const friendUUID = rawFriends.keys()[i];
      const friendStatus = rawFriends.getValue(friendUUID);

      const friendData = await RequestUser(friendUUID);
      newFriendsArray.push({ friendData, status: friendStatus });
    }

    setFriends(newFriendsArray);
  }

  // MainView End

  // Theme Engine Code
  let t = undefined;
  t = ThemeEngine.GetTheme(cTheme);

  return (
    <div className="App" onContextMenu={(event) => event.preventDefault()}>
      <Helmet>
        <title>{title && title.length > 0 ? `${Localizations_Common("AppTitle")} - ${title}` : Localizations_Common("AppTitle")}</title>
      </Helmet>
      <ThemeProvider theme={t.theme}>
        <RoutingGroup>
          <Route path="*" element={<ErrorView sharedProps={SharedProps} errorCode={404} />} />
          <Route path={Routes.Auth} element={<AuthView sharedProps={SharedProps} />}>
            <Route path={Routes.Login} element={<LoginPage sharedProps={SharedProps} />} />
            <Route path={Routes.Register} element={<RegisterPage sharedProps={SharedProps} />} />
            <Route path={Routes.Reset} element={<ResetPage sharedProps={SharedProps} />} />
            <Route path={Routes.RequestReset} element={<RequestResetPage sharedProps={SharedProps} />} />
            <Route path={Routes.Confirm} element={<ConfirmPage sharedProps={SharedProps} />} />
          </Route>
          <Route path={Routes.Root} element={<MainView sharedProps={SharedProps} sessionRef={session} channels={channels} messages={messages} setChannels={setChannels} setFriends={setFriends} setMessages={setMessages} avatarNonce={avatarNonce} selectedChannel={selectedChannel} channelMenuVisible={channelMenuVisible} onNavigateToPage={onMainViewNavigateToPage} setChannelMenuVisibility={setChannelMenuVisibility} loadChannels={loadChannels} populateFriendsList={populateFriendsList} onChannelClearCache={onChannelClearCache} onChannelClick={selectChannel} onChannelDelete={onChannelDelete} onChannelEdit={onChannelEdit} onChannelMenuToggle={onChannelMenuToggle} onChannelMove={onChannelMove} onChannelRemoveRecipient={onChannelRemoveRecipient} onChannelResetIcon={onChannelResetIcon} />}>
            <Route path={Routes.Friends} element={<FriendView sharedProps={SharedProps} />}>
              <Route path={Routes.FriendsList} element={<FriendPage sharedProps={SharedProps} friends={friends} onReloadList={populateFriendsList} onFriendClicked={onFriendClicked} onCreateGroup={onCreateGroup} onBlockFriend={onBlockFriend} onUnblockFriend={onUnblockFriend} onRemoveFriend={onRemoveFriend} />} />
              <Route path={Routes.AddFriend} element={<AddFriendsPage sharedProps={SharedProps} onAddFriend={onAddFriend} />} />
              <Route path={Routes.AddFriendGroup} element={<FriendPage sharedProps={SharedProps} friends={friends} onReloadList={populateFriendsList} onFriendClicked={onFriendClicked} onCreateGroup={onCreateGroup} onBlockFriend={onBlockFriend} onUnblockFriend={onUnblockFriend} onRemoveFriend={onRemoveFriend} />} />
              <Route path={Routes.BlockedUsersList} element={<BlockedUsersPage sharedProps={SharedProps} friends={friends} onReloadList={populateFriendsList} onUnblockFriend={onUnblockFriend} />} />
            </Route>
            <Route path={Routes.Settings} element={<SettingsView sharedProps={SharedProps} />}>
              <Route path={Routes.Dashboard} element={<DashboardPage sharedProps={SharedProps} avatarNonce={avatarNonce} onAvatarChanged={onAvatarChanged} onLogout={onLogout} />} />
            </Route>
            <Route path={Routes.Chat} element={<ChatPage sharedProps={SharedProps} attachments={MessageAttachments} canvasRef={canvasRef} channels={channels} messages={messages} selectChannel={selectChannel} onFileUpload={onFileUpload} onFileRemove={onFileRemove} onMessageEdit={onMessageEdit} onMessageDelete={onMessageDelete} onMessageInputSubmit={onMessageInputSubmit} onLoadPriorMessages={onLoadPriorMessages} />}>
              <Route path={`${Routes.Chat}/:uuid`} element={<ChatPage sharedProps={SharedProps} attachments={MessageAttachments} canvasRef={canvasRef} channels={channels} messages={messages} selectChannel={selectChannel} onFileUpload={onFileUpload} onFileRemove={onFileRemove} onMessageEdit={onMessageEdit} onMessageDelete={onMessageDelete} onMessageInputSubmit={onMessageInputSubmit} onLoadPriorMessages={onLoadPriorMessages} />} />
            </Route>
          </Route>
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
      </ThemeProvider>
    </div>
  );
}

export default App;
