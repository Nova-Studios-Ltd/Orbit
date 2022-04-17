import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { SENDMessage } from "NSLib/APIEvents";
import { useNavigate } from "react-router-dom";
import { NCFile, UploadFile } from "NSLib/ElectronAPI";

import PageContainer from "Components/Containers/PageContainer/PageContainer";
import MessageAttachment from "DataTypes/MessageAttachment";
import ChannelList from "Components/Channels/ChannelList/ChannelList";
import ChatView from "Views/ChatView/ChatView";

import type { Page } from "DataTypes/Components";
import type { IRawChannelProps } from "Interfaces/IRawChannelProps";
import type { ChannelProps } from "Components/Channels/Channel/Channel";
import type { IMessageProps } from "Interfaces/IMessageProps";
import type { MessageProps } from "Components/Messages/Message/Message";
import type { MessageInputChangeEvent, MessageInputSendEvent } from "Components/Input/MessageInput/MessageInput";
import AvatarTextButton from "Components/Buttons/AvatarTextButton/AvatarTextButton";
import { ChatViewRoutes, MainViewRoutes } from "DataTypes/Routes";

interface ChatPageProps extends Page {
  channels?: IRawChannelProps[],
  messages?: IMessageProps[],
  selectedChannel?: IRawChannelProps,
  path?: ChatViewRoutes,
  setSelectedChannel?: React.Dispatch<React.SetStateAction<IRawChannelProps>>,
  onChannelCreate?: (recipient: string) => void,
  onChannelEdit?: (channel: ChannelProps) => void,
  onChannelDelete?: (channel: ChannelProps) => void,
  onChannelClick?: (channel: ChannelProps) => void,
  onMessageEdit?: (message: MessageProps) => void,
  onMessageDelete?: (message: MessageProps) => void
}

function ChatPage({ ContextMenu, widthConstrained, channels, messages, selectedChannel, path, setSelectedChannel, onChannelCreate, onChannelEdit, onChannelDelete, onChannelClick, onMessageEdit, onMessageDelete, changeTitleCallback }: ChatPageProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const Localizations_ChatPage = useTranslation("ChatPage").t;

  const [MessageInputValue, setMessageInputValue] = useState("");
  const [MessageAttachments, setMessageAttachments] = useState([] as MessageAttachment[])

  useEffect(() => {
    if (changeTitleCallback && selectedChannel && selectedChannel.channelName) changeTitleCallback(`@${selectedChannel.channelName}`);
  }, [changeTitleCallback, selectedChannel]);

  const MessageInputChangedHandler = (event: MessageInputChangeEvent) => {
    const value = event && event.value ? event.value : "";
    setMessageInputValue(value);
  };

  const MessageInputSendHandler = (event: MessageInputSendEvent) => {
    if (selectedChannel === undefined || event.value === undefined || (event.value === "" && MessageAttachments.length === 0)) return;
    SENDMessage(selectedChannel.table_Id, event.value, MessageAttachments, (sent: boolean) => {
      if (sent) {
        setMessageInputValue("");
        setMessageAttachments([]);
      }
    });
  };

  const handleFileUpload = () => {
    UploadFile().then((files) => {
      files.forEach((v: NCFile) => {
        console.log(v.Filename);
        setMessageAttachments([...MessageAttachments, new MessageAttachment(v.FileContents, v.Filename)]);
      });
    });
  };

  const navigateFriendsPage = () => {
    if (setSelectedChannel) setSelectedChannel(null as unknown as IRawChannelProps);
    navigate(MainViewRoutes.Friends);
  }

  return (
    <PageContainer noPadding>
      <div className="ChatPageContainer">
        <div className="ChatPageContainerLeft">
          <div className="NavigationButtonContainer" style={{ backgroundColor: theme.palette.background.paper, borderColor: theme.palette.divider }}>
            <AvatarTextButton selected={path === ChatViewRoutes.Friends} onLeftClick={navigateFriendsPage}>[Friends]</AvatarTextButton>
          </div>
          <ChannelList ContextMenu={ContextMenu} channels={channels} onChannelEdit={onChannelEdit} onChannelDelete={onChannelDelete} onChannelClick={onChannelClick} selectedChannel={selectedChannel} />
        </div>
        <ChatView className="ChatPageContainerRight" ContextMenu={ContextMenu} widthConstrained={widthConstrained} messages={messages} selectedChannel={selectedChannel} MessageInputValue={MessageInputValue} onChannelCreate={onChannelCreate} MessageInputChangedHandler={MessageInputChangedHandler} MessageInputSendHandler={MessageInputSendHandler} handleFileUpload={handleFileUpload} onMessageEdit={onMessageEdit} onMessageDelete={onMessageDelete} path={path} />
      </div>
    </PageContainer>
  );
}

export default ChatPage;
