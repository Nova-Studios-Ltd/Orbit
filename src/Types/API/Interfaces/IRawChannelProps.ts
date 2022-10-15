export interface IRawChannelProps {
    table_Id: string,
    owner_UUID?: string,
    channelType?: number,
    channelName: string,
    channelIcon?: string,
    members?: string[],
}
