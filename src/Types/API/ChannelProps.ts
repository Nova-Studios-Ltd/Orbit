import { ChannelTypes } from "Types/API/Enum";

/**
 * Represents a API data object for a Channel
 */
export class ChannelProps {
  table_Id?: string;
  owner_UUID?: string;
  channelType?: ChannelTypes;
  channelName?: string;
  channelIcon?: string;
  members?: string[];
}
