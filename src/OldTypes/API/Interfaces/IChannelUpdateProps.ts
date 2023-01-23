import { NCFile } from "Lib/ElectronAPI";
import { IRawChannelProps } from "OldTypes/API/Interfaces/IRawChannelProps";

export interface IChannelUpdateProps extends Omit<IRawChannelProps, "channelIcon"> {
  channelIcon?: NCFile,
}
