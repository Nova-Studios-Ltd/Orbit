import type { IRawChannelProps } from "Interfaces/IRawChannelProps"

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
