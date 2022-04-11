import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AutoLogin, Manager } from "Init/AuthHandler";
import { SettingsManager } from "NSLib/SettingsManager";

import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";
import ChatPage from "Pages/ChatPage/ChatPage";
import SettingsPage from "Pages/SettingsPage/SettingsPage";

import type { View } from "DataTypes/Components";
import type { IRawChannelProps } from "Interfaces/IChannelProps";
import { ChannelType } from "DataTypes/Enums";
import { MainViewRoutes } from "DataTypes/Routes";
import type { ChannelClickEvent } from "Components/Channels/Channel/Channel";
import type { ChannelListProps } from "Components/Channels/ChannelList/ChannelList";

interface MainViewProps extends View {
  path: MainViewRoutes
}

function MainView({ path, changeTitleCallback } : MainViewProps) {
  const navigate = useNavigate();

  const onChannelClick = (event: ChannelClickEvent) => {
    console.log("Channel clicked: ", event);
  }

  const channels: IRawChannelProps[] = [
    { channelName: "Channel1", table_Id: "0", owner_UUID: "0", channelType: ChannelType.User, members: ["User0", "User1"] }
  ]; // Placeholder for testing
  // TODO: Convert this to state and implement logic for updating it with the API

  const channelData: ChannelListProps = {
    channels: channels,
    onChannelClick: onChannelClick
  } // TODO: Convert this to state

  useEffect(() => {
    AutoLogin().then((result: boolean) => {
      if (!result) navigate("/login");
    });
  });

  console.log(new SettingsManager().User);

  const page = () => {
    switch (path) {
      case MainViewRoutes.Chat:
        return (<ChatPage channelData={channelData} changeTitleCallback={changeTitleCallback} />);
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
