import { createContext } from "react";
import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import MessageCanvas from "Components/Messages/MessageCanvas/MessageCanvas";
import MessageInput, { MessageInputSendEvent } from "Components/Input/MessageInput/MessageInput";

import type { NCComponent, SharedProps } from "Types/UI/Components";
import type { IMessageProps } from "Types/API/Interfaces/IMessageProps";
import type { MessageProps } from "Components/Messages/Message/Message";
import type MessageAttachment from "Types/API/MessageAttachment";

export interface ChatPageProps extends NCComponent {
  attachments?: MessageAttachment[],
  canvasRef?: React.MutableRefObject<HTMLDivElement>,
  messages?: IMessageProps[],
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

  const SharedPropsContext = createContext({} as SharedProps);

  return (
    <SharedPropsContext.Consumer>
      {
        sharedProps => {
          return (
            <>
              <MessageCanvas className="MainViewContainerItem" canvasRef={props.canvasRef} messages={props.messages} onMessageEdit={props.onMessageEdit} onMessageDelete={props.onMessageDelete} onLoadPriorMessages={props.onLoadPriorMessages} />
              <MessageInput className="MainViewContainerItem" attachments={props.attachments} onFileRemove={props.onFileRemove} onFileUpload={props.onFileUpload} onSend={props.onMessageInputSubmit} />
            </>
          );
        }
      }
    </SharedPropsContext.Consumer>
  )
}

export default ChatPage;
