export enum Routes {
  Root = "/", // X

  Auth = "/auth", // X
  Login = "/auth/login",
  Register = "/auth/register",

  Chat = "/chat",

  Friends = "/friends", // X
  BlockedUsersList = "/friends/blacklist",
  AddFriend = "/friends/add",
  AddFriendGroup = "/friends/list?creategroup",
  FriendsList = "/friends/list",

  Settings = "/settings", // X
  Dashboard = "/settings/dash"
}

// Entries marked with an X indicate that it shall not be referenced as a path directly (you'll end up with a blank page)
