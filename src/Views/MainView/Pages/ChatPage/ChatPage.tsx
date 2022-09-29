import { useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import MessageCanvas from "Components/Messages/MessageCanvas/MessageCanvas";
import MessageInput, { MessageInputSendEvent } from "Components/Input/MessageInput/MessageInput";

import type { NCComponent } from "Types/UI/Components";
import type { IMessageProps } from "Types/API/Interfaces/IMessageProps";
import type { MessageProps } from "Components/Messages/Message/Message";
import type MessageAttachment from "Types/API/MessageAttachment";
import type{ IRawChannelProps } from "Types/API/Interfaces/IRawChannelProps";

export interface ChatPageProps extends NCComponent {
  attachments?: MessageAttachment[],
  canvasRef?: React.MutableRefObject<HTMLDivElement>,
  channels?: IRawChannelProps[],
  messages?: IMessageProps[],
  selectChannel?: (channel: IRawChannelProps) => void,
  onFileUpload?: (clipboard?: boolean, event?: React.ClipboardEvent<HTMLInputElement>) => void,
  onFileRemove?: (id?: string) => void,
  onMessageEdit?: (message: MessageProps) => void,
  onMessageDelete?: (message: MessageProps) => void,
  onMessageInputSubmit?: (event: MessageInputSendEvent) => void,
  onLoadPriorMessages?: () => void,
}

function ChatPage(props: ChatPageProps) {
  const theme = useTheme();
  const classNames = useClassNames("ComponentContainer", props.className);
  const Localizations_MainView = useTranslation("MainView").t;

  const { uuid } = useParams();

  if (uuid && uuid.length > 0 && props.channels && props.selectChannel) {
    for (let i = 0; i < props.channels.length; i++) {
      const channel = props.channels[i];
      if (channel.table_Id === uuid) {
        props.selectChannel(channel);
        if (props.sharedProps && props.sharedProps.changeTitleCallback && channel.channelName) props.sharedProps.changeTitleCallback(channel.channelName);
        break;
      }
    }
  }

  return (
    <>
      <MessageCanvas className="MainViewContainerItem" canvasRef={props.canvasRef} messages={props.messages} onMessageEdit={props.onMessageEdit} onMessageDelete={props.onMessageDelete} onLoadPriorMessages={props.onLoadPriorMessages} />
      <MessageInput className="MainViewContainerItem" attachments={props.attachments} onFileRemove={props.onFileRemove} onFileUpload={props.onFileUpload} onSend={props.onMessageInputSubmit} />
    </>
  );
}

export default ChatPage;
