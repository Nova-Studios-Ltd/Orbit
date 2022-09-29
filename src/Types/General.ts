import type { IRawChannelProps } from "Types/API/Interfaces/IRawChannelProps"
import type { DebugMessageType } from "./Enums"

export interface IOpenFileDialogResults {
    path: string,
    contents?: Buffer
}

export interface Coordinates {
  x: number,
  y: number
}

export interface ChannelMoveData {
  channelData: IRawChannelProps,
  index: number
}

export interface DebugMessage {
  type: DebugMessageType,
  message: string,
  timestamp?: number
}
