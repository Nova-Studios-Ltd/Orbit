import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AutoLogin } from "Init/AuthHandler";
import { SettingsManager } from "NSLib/SettingsManager";

import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";
import ChatPage from "Pages/ChatPage/ChatPage";
import SettingsPage from "Pages/SettingsPage/SettingsPage";

import type { View } from "DataTypes/Components";
import type { IRawChannelProps } from "Interfaces/IRawChannelProps";
import { MainViewRoutes } from "DataTypes/Routes";
import type { ChannelClickEvent } from "Components/Channels/Channel/Channel";
import type { ChannelListProps } from "Components/Channels/ChannelList/ChannelList";
import { GETChannel, GETMessages, GETUserChannels } from "NSLib/APIEvents";
import { IMessageProps } from "Interfaces/IMessageProps";
import { MessageCanvasProps } from "Components/Messages/MessageCanvas/MessageCanvas";
import { Events } from "Init/WebsocketEventInit";

interface MainViewProps extends View {
  path: MainViewRoutes
}

function MainView({ path, changeTitleCallback } : MainViewProps) {
  const navigate = useNavigate();

  const [channels, setChannels] = useState([] as IRawChannelProps[]);
  const [selectedChannel, setSelectedChannel] = useState(null as unknown as IRawChannelProps);
  const [channelUUID, setChannel] = useState("");
  const [messages, setMessages] = useState([] as IMessageProps[]);


  const onChannelClick = (event: ChannelClickEvent) => {
    console.log("Channel clicked: ", event);
    setSelectedChannel({ table_Id: event.channelID, channelName: event.channelName, channelIcon: event.channelIconSrc, members: event.channelMembers, channelType: event.isGroup } as IRawChannelProps);
    if (event.channelID === undefined) return;
    setChannel(event.channelID);
    GETMessages(event.channelID, (decrypt: IMessageProps[]) => {
      setMessages(decrypt);
    });
  }

  Events.on("NewMessage", (message: IMessageProps) => {
    setMessages(prevState => {
      return [...prevState, message];
    });
  });

  useEffect(() => {

  });

  const channelData: ChannelListProps = {
    channels: channels,
    onChannelClick: onChannelClick
  }

  useEffect(() => {
    AutoLogin().then((result: boolean) => {
      if (!result) navigate("/login");
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
        return (<ChatPage channelData={channelData} messages={messages} channel_uuid={channelUUID} changeTitleCallback={changeTitleCallback} selectedChannel={selectedChannel} />);
      case MainViewRoutes.Settings:
        return (<SettingsPage changeTitleCallback={changeTitleCallback} />);
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
