// Entries marked with an X indicate that it shall not be referenced as a path directly (you'll end up with a blank page)

export enum Routes {
  Root = "/", // X

  Auth = "/auth", // X
  Login = "/auth/login",
  Register = "/auth/register",
  Confirm = "/auth/confirm",
  Reset = "/auth/reset",
  RequestReset = "/auth/req-reset",

  Chat = "/chat",

  Friends = "/friends", // X
  BlockedUsersList = "/friends/blacklist",
  AddFriend = "/friends/add",
  FriendsList = "/friends/list",

  Settings = "/settings", // X
  Dashboard = "/settings/dash",
  Debug = "/settings/debug"
}

export enum SpecialRoutes {
  Back = "-1",
  Forward = "+1"
}

export enum Params {
  CreateGroup = "createGroup"
}

export interface Param {
  key: string,
  value?: string,
  unsetOnNavigate?: boolean
}

export interface HistoryEntry {
  pathname: string,
  params?: Param[],
  title?: string,
}
