import type IUserData from "Types/API/Interfaces/IUserData";

export default interface Friend {
  friendData?: IUserData,
  status?: FriendStatus,
  uiStates?: {
    isOwner?: boolean,
    removable?: boolean
  }
}

export interface FriendStatus {
  uuid?: string,
  state?: "Accepted" | "Blocked" | "Pending" | "Request"
}
