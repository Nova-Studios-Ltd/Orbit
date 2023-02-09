import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import MessageCanvas from "Components/Messages/MessageCanvas/MessageCanvas";
import MessageInput from "Components/Input/MessageInput/MessageInput";

import { useDispatch, useSelector } from "Redux/Hooks";
import { selectMessagesByChannel } from "Redux/Selectors/MessageSelectors";
import { MessagesPopulate, MessageFileUpload, MessageEdit, MessageDelete, MessageFileRemove, MessageInputSubmit } from "Redux/Thunks/Messaging";

import type { NCComponent } from "Types/UI/Components";
import { MessageProps } from "Components/Messages/Message/Message";

export interface ChatPageProps extends NCComponent {

}

function ChatPage(props: ChatPageProps) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const classNames = useClassNames("ComponentContainer", props.className);
  const Localizations_MainView = useTranslation("MainView").t;

  const messages = useSelector(selectMessagesByChannel());
  const attachments = useSelector(state => state.chat.attachments);

  const onMessageEdit = (message: MessageProps) => {
    dispatch(MessageEdit(message));
  }

  const onMessageDelete = (message: MessageProps) => {
    dispatch(MessageDelete(message));
  }

  return (
    <>
      <MessageCanvas className="MainViewContainerItem" messages={messages} onMessageEdit={onMessageEdit} onMessageDelete={onMessageDelete} onLoadPriorMessages={() => dispatch(MessagesPopulate())} />
      <MessageInput className="MainViewContainerItem" attachments={attachments} onFileRemove={(id) => dispatch(MessageFileRemove(id))} onFileUpload={(clipboard, event) => dispatch(MessageFileUpload(clipboard, event))} onSend={(event) => dispatch(MessageInputSubmit(event))} />
    </>
  );
}

export default ChatPage;
