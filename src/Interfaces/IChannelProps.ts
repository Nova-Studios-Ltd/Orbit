import type { ChannelType } from "../DataTypes/Enums";

export interface IChannelProps {
    table_Id: string,
    owner_UUID?: string,
    isGroup: ChannelType,
    channelName: string,
    channelIcon?: string,
    members?: string[],
    isSelected: boolean,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>, channelID: string) => void
}