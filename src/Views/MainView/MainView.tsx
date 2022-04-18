import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AutoLogin } from "Init/AuthHandler";
import { SettingsManager } from "NSLib/SettingsManager";
import { Events } from "Init/WebsocketEventInit";
import { CREATEChannel, DELETEMessage, GETChannel, GETMessages, GETUserChannels, GETUserUUID } from "NSLib/APIEvents";

import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";
import ChatPage from "Pages/ChatPage/ChatPage";
import FriendPage from "Pages/FriendPage/FriendPage";
import SettingsPage from "Pages/SettingsPage/SettingsPage";

import type { View } from "DataTypes/Components";
import type { IRawChannelProps } from "Interfaces/IRawChannelProps";
import type { ChannelProps } from "Components/Channels/Channel/Channel";
import type { IMessageProps } from "Interfaces/IMessageProps";
import type { MessageProps } from "Components/Messages/Message/Message";
import { AuthViewRoutes, ChatViewRoutes, MainViewRoutes } from "DataTypes/Routes";
import { isValidUsername } from "NSLib/Util";

interface MainViewProps extends View {
  path: MainViewRoutes
}

function MainView({ path, ContextMenu, HelpPopup, widthConstrained, changeTitleCallback } : MainViewProps) {
  const navigate = useNavigate();

  const [channels, setChannels] = useState([] as IRawChannelProps[]);
  const [selectedChannel, setSelectedChannel] = useState(null as unknown as IRawChannelProps);
  const [messages, setMessages] = useState([] as IMessageProps[]);

  const onChannelClick = (channel: ChannelProps) => {
    console.log("Channel clicked: ", channel);
    navigate(MainViewRoutes.Chat);
    setSelectedChannel({ table_Id: channel.channelID, channelName: channel.channelName, channelIcon: channel.channelIconSrc, members: channel.channelMembers, channelType: channel.isGroup } as IRawChannelProps);

    if (channel && channel.channelID) {
      GETMessages(channel.channelID, (decrypt: IMessageProps[]) => {
        setMessages(decrypt);
      });
    }
  }

  const onChannelCreate = async (recipient: string) => {
    console.log(`Request to create new channel with recipient ${recipient}`);
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

  const onMessageEdit = (message: MessageProps) => {
    console.log(`Request to edit message ${message.id}`);
    // TODO: Add Message edit logic here
  };

  const onMessageDelete = async (message: MessageProps) => {
    console.log(`Request to delete message ${message.id}`);
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

    Events.on("NewChannel", (channel: IRawChannelProps) => {
      setChannels([...channels, channel]);
    });

    return (() => {
      Events.remove("NewMessage");
      Events.remove("DeleteMessage");
    });
  }, [messages]);


  useEffect(() => {
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
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(new SettingsManager().User);

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
