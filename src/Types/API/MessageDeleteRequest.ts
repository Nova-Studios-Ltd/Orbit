export class MessageDeleteRequest {
  channelID: string;
  messageID: string;

  constructor(channelID: string, messageID: string) {
    this.channelID = channelID
    this.messageID = messageID
  }
}
