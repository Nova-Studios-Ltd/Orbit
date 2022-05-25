import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AutoLogin } from "Init/AuthHandler";
//import { SettingsManager } from "NSLib/SettingsManager";
import { Events } from "Init/WebsocketEventInit";
import { CREATEChannel, DELETEMessage, EDITMessage, GETChannel, GETMessage, GETMessageEditTimestamps, GETMessages, GETUserChannels, GETUserUUID } from "NSLib/APIEvents";

import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";
import ChatPage from "Pages/ChatPage/ChatPage";
//import FriendPage from "Pages/FriendPage/FriendPage";
import SettingsPage from "Pages/SettingsPage/SettingsPage";

import type { View } from "DataTypes/Components";
import type { IRawChannelProps } from "Interfaces/IRawChannelProps";
import type { ChannelProps } from "Components/Channels/Channel/Channel";
import type { IMessageProps } from "Interfaces/IMessageProps";
import type { MessageProps } from "Components/Messages/Message/Message";
import { AuthViewRoutes, ChatViewRoutes, MainViewRoutes } from "DataTypes/Routes";
import { CacheValid, HasChannelCache, isValidUsername } from "NSLib/Util";
import { GenerateBase64SHA256 } from "NSLib/NCEncryption";
import { NCChannelCache } from "NSLib/NCCache";
import { HasFlag } from "NSLib/NCFlags";

interface MainViewProps extends View {
  path: MainViewRoutes
}

function MainView({ path, ContextMenu, HelpPopup, widthConstrained, changeTitleCallback } : MainViewProps) {
  const navigate = useNavigate();

  const [channels, setChannels] = useState([] as IRawChannelProps[]);
  const [selectedChannel, setSelectedChannel] = useState(null as unknown as IRawChannelProps);
  const [messages, setMessages] = useState([] as IMessageProps[]);
  const session = useRef("");


  const onChannelClick = async (channel: ChannelProps) => {
    //navigate(MainViewRoutes.Chat);
    setSelectedChannel({ table_Id: channel.channelID, channelName: channel.channelName, channelIcon: channel.channelIconSrc, members: channel.channelMembers, channelType: channel.isGroup } as IRawChannelProps);

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
    // TODO: Add Channel deletion logic here
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

  const ChatPageProps = {
    ContextMenu: ContextMenu,
    widthConstrained: widthConstrained,
    HelpPopup: HelpPopup,
    channels: channels,
    messages: messages,
    selectedChannel: selectedChannel,
    setSelectedChannel: setSelectedChannel,
    onChannelCreate: onChannelCreate,
    onChannelEdit: onChannelEdit,
    onChannelDelete: onChannelDelete,
    onChannelClick: onChannelClick,
    onMessageEdit: onMessageEdit,
    onMessageDelete: onMessageDelete,
    changeTitleCallback: changeTitleCallback
  };

  useEffect(() => {
    Events.on("NewMessage", (message: IMessageProps) => {
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
      })
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
      setChannels([...channels, channel]);
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
    switch (path) {
      case MainViewRoutes.Chat:
        return (<ChatPage {...ChatPageProps} path={ChatViewRoutes.Chat} />);
      case MainViewRoutes.Friends:
        return (<ChatPage {...ChatPageProps} path={ChatViewRoutes.Friends} />);
      case MainViewRoutes.Settings:
        return (<SettingsPage ContextMenu={ContextMenu} widthConstrained={widthConstrained} HelpPopup={HelpPopup} changeTitleCallback={changeTitleCallback} />);
      default:
        console.warn("[MainView] Invalid Page");
        return null;
    }
  }

  return (
    <ViewContainer>
      {page()}
    </ViewContainer>
  );
}

export default MainView;
