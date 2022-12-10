import type IUserData from "Types/API/Interfaces/IUserData";

export default interface Friend {
  friendData?: IUserData,
  status?: string,
  uiStates?: {
    isOwner?: boolean,
    removable?: boolean
  }
}
