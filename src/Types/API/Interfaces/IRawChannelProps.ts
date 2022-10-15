import type { ChannelTypes } from "Types/Enums";

export interface IRawChannelProps {
    table_Id: string,
    owner_UUID?: string,
    channelType?: ChannelTypes,
    channelName: string,
    channelIcon?: string,
    members?: string[],
}
