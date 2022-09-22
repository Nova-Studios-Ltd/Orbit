import { createContext } from "react";
import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";\

import MessageCanvas from "Components/Messages/MessageCanvas/MessageCanvas";
import MessageInput from "Components/Input/MessageInput/MessageInput";

import type { NCComponent, SharedProps } from "Types/UI/Components";

export interface ChatPageProps extends NCComponent {

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
              <MessageCanvas className="MainViewContainerItem" canvasRef={canvasRef} messages={messages} onMessageEdit={onMessageEdit} onMessageDelete={onMessageDelete} onLoadPriorMessages={onLoadPriorMessages} />
              <MessageInput className="MainViewContainerItem" attachments={MessageAttachments} onFileRemove={onFileRemove} onFileUpload={onFileUpload} onSend={MessageInputSendHandler} />
            </>
          );
        }
      }
    </SharedPropsContext.Consumer>
  )
}

export default ChatPage;
