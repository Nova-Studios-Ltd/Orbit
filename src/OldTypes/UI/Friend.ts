import type IUserData from "OldTypes/API/Interfaces/IUserData";

export default interface Friend {
  friendData?: IUserData,
  status?: string,
  uiStates?: {
    isOwner?: boolean,
    removable?: boolean
  }
}
