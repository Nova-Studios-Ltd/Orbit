import type { NCFile } from "NSLib/ElectronAPI";

export interface IChannelUpdateProps {
    table_Id: string,
    owner_UUID?: string,
    isGroup?: boolean,
    channelName: string,
    channelIcon?: NCFile,
    members?: string[],
}
