import type { ChannelType } from "../DataTypes/Enums";

export interface IRawChannelProps {
    table_Id: string,
    owner_UUID?: string,
    channelType?: ChannelType,
    channelName: string,
    channelIcon?: string,
    members?: string[],
}
