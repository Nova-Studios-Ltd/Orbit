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

function ChatPage(props: ChatPageProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const Localizations_ChatPage = useTranslation("ChatPage").t;

  const [MessageAttachments, setMessageAttachments] = useState([] as MessageAttachment[])

  useEffect(() => {
    if (props.changeTitleCallback && props.selectedChannel && props.selectedChannel.channelName) props.changeTitleCallback(`@${props.selectedChannel.channelName}`);
  }, [props, props.changeTitleCallback, props.selectedChannel]);

  const MessageInputSendHandler = (event: MessageInputSendEvent) => {
    if (props.selectedChannel === undefined || event.value === undefined || (event.value === "" && MessageAttachments.length === 0)) return;
    SENDMessage(props.selectedChannel.table_Id, event.value, MessageAttachments, (sent: boolean) => {
      if (sent) {
        setMessageAttachments([] as MessageAttachment[]);
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

  const handleFileRemove = (id: string) => {
    const updatedMessageAttachments = [];
    for (let i = 0; i < MessageAttachments.length; i++) {
      if (MessageAttachments[i].id !== id) {
        updatedMessageAttachments.push(MessageAttachments[i]);
      }
    }

    setMessageAttachments(updatedMessageAttachments);
  };

  const navigateFriendsPage = () => {
    if (props.setSelectedChannel) props.setSelectedChannel(null as unknown as IRawChannelProps);
    navigate(MainViewRoutes.Friends);
  }

  return (
    <PageContainer noPadding>
      <div className="ChatPageContainer">
        <div className="ChatPageContainerLeft">
          <div className="NavigationButtonContainer" style={{ backgroundColor: theme.palette.background.paper, borderColor: theme.palette.divider }}>
            <AvatarTextButton selected={props.path === ChatViewRoutes.Friends} onLeftClick={navigateFriendsPage}>[Friends]</AvatarTextButton>
          </div>
          <ChannelList ContextMenu={props.ContextMenu} channels={props.channels} onChannelEdit={props.onChannelEdit} onChannelDelete={props.onChannelDelete} onChannelClick={props.onChannelClick} selectedChannel={props.selectedChannel} />
        </div>
        <ChatView className="ChatPageContainerRight" ContextMenu={props.ContextMenu} widthConstrained={props.widthConstrained} path={props.path} attachments={MessageAttachments} onFileRemove={handleFileRemove} changeTitleCallback={props.changeTitleCallback} messages={props.messages} selectedChannel={props.selectedChannel} onChannelCreate={props.onChannelCreate} MessageInputSendHandler={MessageInputSendHandler} onFileUpload={handleFileUpload} onMessageEdit={props.onMessageEdit} onMessageDelete={props.onMessageDelete} />
      </div>
    </PageContainer>
  );
}

export default ChatPage;
