export interface IRawChannelProps {
    table_Id: string,
    owner_UUID?: string,
    isGroup?: boolean,
    channelName: string,
    channelIcon?: string,
    members?: string[],
}
