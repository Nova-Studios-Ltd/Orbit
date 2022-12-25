import { NCFile } from "Lib/ElectronAPI";
import { IRawChannelProps } from "Types/API/Interfaces/IRawChannelProps";

export interface IChannelUpdateProps extends Omit<IRawChannelProps, "channelIcon"> {
  channelIcon?: NCFile,
}
