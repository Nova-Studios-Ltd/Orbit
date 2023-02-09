import { IRawChannelProps } from "Types/API/Interfaces/IRawChannelProps";
import type { ChannelTypes } from "Types/Enums";
import type Friend from "Types/UI/Friend";

export interface INotSoRawChannelProps extends IRawChannelProps {
  ui?: {
    members: Friend[]
  }
}
