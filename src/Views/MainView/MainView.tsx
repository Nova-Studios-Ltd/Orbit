import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AutoLogin, Logout } from "Init/AuthHandler";
import { Events } from "Init/WebsocketEventInit";
import { IconButton, useTheme } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { CacheValid, HasChannelCache, isValidUsername } from "NSLib/Util";
import { GenerateBase64SHA256 } from "NSLib/NCEncryption";
import { NCChannelCache } from "NSLib/NCCache";
import { HasFlag } from "NSLib/NCFlags";
import { UploadFile } from "NSLib/ElectronAPI";
import { SettingsManager } from "NSLib/SettingsManager";
import { CREATEChannel, DELETEChannel, DELETEMessage, EDITMessage, GETChannel, GETMessage, GETMessageEditTimestamps, GETMessages, GETUserChannels, GETUserUUID, SENDMessage } from "NSLib/APIEvents";

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
import type { ChannelProps } from "Components/Channels/Channel/Channel";
import type { IMessageProps } from "Interfaces/IMessageProps";
import type { MessageProps } from "Components/Messages/Message/Message";
import { AuthViewRoutes, MainViewRoutes, SettingsViewRoutes } from "DataTypes/Routes";

interface MainViewProps extends View {
  path: MainViewRoutes
}

function MainView(props: MainViewProps) {
  const Localizations_MainView = useTranslation("MainView").t;
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const canvasRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const messageCount = useRef(0);
  const session = useRef("");
  const autoScroll = useRef(true);

  const [title, setTitle] = useState("");
  const [channels, setChannels] = useState([] as IRawChannelProps[]);
  const [selectedChannel, setSelectedChannel] = useState(null as unknown as IRawChannelProps);
  const [messages, setMessages] = useState([] as IMessageProps[]);
  const [MessageAttachments, setMessageAttachments] = useState([] as MessageAttachment[]);
  const [channelMenuOpen, setChannelMenuVisibility] = useState(true);

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
      canvas.scroll({ top: canvas.scrollHeight, behavior: "smooth" });
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
    const oldestID = parseInt(messages[messages.length - 1].message_Id);
    GETMessages(selectedChannel.table_Id, (messages: IMessageProps[]) => {
      autoScroll.current = false;
      setMessages(prevState => {
        return [...prevState, ...messages];
      })
    }, false, 30, -1, oldestID);
  }

  const onFileUpload = () => {
    UploadFile().then((files) => {
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

  const onChannelClick = async (channel: ChannelProps) => {
    if (!location.pathname.includes("chat"))
      navigate(`${MainViewRoutes.Chat}${location.search}`);
    setSelectedChannel({ table_Id: channel.channelID, channelName: channel.channelName, channelIcon: channel.channelIconSrc, members: channel.channelMembers, channelType: channel.isGroup } as IRawChannelProps);
    if (channel.channelName) setTitle(channel.channelName);
    setChannelMenuVisibility(false);

    if (channel && channel.channelID) {
      if (await HasChannelCache(channel.channelID) && !await CacheValid(channel.channelID, session.current) && !HasFlag("no-cache")) {
        const cache = new NCChannelCache(channel.channelID);
        GETMessages(channel.channelID, async (messages: IMessageProps[]) => {
          // Get any new messages we may have missed while offline
          if (messages.length === 0) {
            setMessages([]);
            return;
          }
          const m_id = (await cache.GetMessages(1)).Messages[0].message_Id;
          if (messages[0].message_Id !== m_id) {
            if (await cache.CacheValid()) {
              const limit = parseInt(messages[0].message_Id) - parseInt(m_id);
              if (channel.channelID === undefined) return;
              GETMessages(channel.channelID, (decrypt: IMessageProps[]) => {
                setMessages(decrypt);
              }, false, limit, parseInt(m_id) - 1, parseInt(messages[0].message_Id) + 1);
            }
            else {
              cache.ClearCache();
              if (channel.channelID === undefined) return;
              GETMessages(channel.channelID, (decrypt: IMessageProps[]) => {
                setMessages(decrypt);
              });
            }
          }
          else {
            if (channel.channelID === undefined) return;
            GETMessages(channel.channelID, (decrypt: IMessageProps[]) => {
              setMessages(decrypt);
            });
          }
          // Now for the fun part... Updating edited messages...
          const oldest = (await cache.GetOldestMessage()).Last_Id;
          const limit = parseInt(messages[0].message_Id) - oldest;
          const remoteTimestamps = await GETMessageEditTimestamps(channel.channelID, limit, oldest - 1, parseInt(messages[0].message_Id) + 1);
          const localTimestamps = await cache.GetMessageEditTimestamps();

          const keys = remoteTimestamps.keys();
          for (let k = 0; k < keys.length; k++) {
            const key = keys[k];
            if (!localTimestamps.containsKey(key) && channel.channelID !== undefined) {
              const message = await GETMessage(channel.channelID, key, true);
              if (message === undefined) continue;
              console.log(`Cache for channel '${channel.channelID}' missing message with id '${message.message_Id}'. Updating...`);
              continue;
            }
            if (remoteTimestamps.getValue(key) !== localTimestamps.getValue(key) && channel.channelID !== undefined) {
              const message = await GETMessage(channel.channelID, key, true);
              if (message === undefined) continue;
              console.log(`Message iwth id '${message.message_Id}' is out of date. Updating...`);
              cache.SetMessage(key, message);
            }
          }
          const kkeys = localTimestamps.keys();
          for (let k = 0; k < kkeys.length; k++) {
            const key = kkeys[k];
            if (remoteTimestamps.containsKey(key)) continue;
            cache.RemoveMessage(key);
          }
        }, true, 1);
      }
      else {
        GETMessages(channel.channelID, (decrypt: IMessageProps[]) => {
          setMessages(decrypt);
        });
      }
    }
  }

  const onChannelCreate = async (recipient: string) => {
    if (isValidUsername(recipient)) {
      const ud = recipient.split("#");
      const user = await GETUserUUID(ud[0], ud[1]);
      if (user === undefined) return;
      CREATEChannel(user, () => {});
    }
  };

  const onChannelEdit = (channel: ChannelProps) => {
    console.log(`Request to edit channel ${channel.channelName}`);
    // TODO: Add Channel edit logic here
  };

  const onChannelDelete = (channel: ChannelProps) => {
    console.log(`Request to delete channel ${channel.channelName}`);
    if (channel.channelID === undefined) return;
    DELETEChannel(channel.channelID, (deleted: boolean) => {
      console.log(`Request to delete channel ${channel.channelID} succesful`);
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

  const onLogout = () => {
    Logout();
    navigate(AuthViewRoutes.Login);
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

    return (() => {
      Events.remove("NewMessage");
      Events.remove("DeleteMessage");
      Events.remove("EditMessage");
    });
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

      if (loadedChannels[0]) onChannelClick(loadedChannels[0]); // Temporary channel preload
    });
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
        return (<FriendView sharedProps={modifiedSharedProps} onChannelCreate={onChannelCreate} />);
      case MainViewRoutes.Settings:
        return (<SettingsView sharedProps={modifiedSharedProps} onLogout={onLogout} path={SettingsViewRoutes.Dashboard} />);
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
          <AvatarTextButton selected={props.path === MainViewRoutes.Settings} onLeftClick={() => navigateToPage(MainViewRoutes.Settings)} iconSrc={new SettingsManager().User.avatarSrc}>[Settings]</AvatarTextButton>
          <AvatarTextButton selected={props.path === MainViewRoutes.Friends} onLeftClick={() => navigateToPage(MainViewRoutes.Friends)}>[Friends]</AvatarTextButton>
        </div>
        <ChannelList sharedProps={props.sharedProps} channels={channels} onChannelEdit={onChannelEdit} onChannelDelete={onChannelDelete} onChannelClick={onChannelClick} selectedChannel={selectedChannel} />
      </div>
    );
  }

  return (
    <ViewContainer>
      <div className="MainViewContainer">
        {MainViewContainerLeft()}
        <div className="MainViewContainerRight">
          <GenericHeader sharedProps={props.sharedProps} title={title} childrenLeft={props.sharedProps?.widthConstrained ? <IconButton onClick={() => onChannelMenuToggle()}><MenuIcon /></IconButton> : null} />
          {page()}
        </div>
      </div>
    </ViewContainer>
  );
}

export default MainView;
