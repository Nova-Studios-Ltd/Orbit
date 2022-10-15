import type { NCFile } from "NSLib/ElectronAPI";
import type { IRawChannelProps } from "./IRawChannelProps";

export interface IChannelUpdateProps extends Omit<IRawChannelProps, "channelIcon"> {
    channelIcon?: NCFile,
}
