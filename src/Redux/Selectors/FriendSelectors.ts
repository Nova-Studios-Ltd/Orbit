import { AppSelector } from "Redux/Store";
import type Friend from "Types/UI/Friend";

export function selectAllFriends(): AppSelector<Friend[]> {
  return (state) => state.friends.friends;
}

export function selectBlockedFriends(): AppSelector<Friend[]> {
  return (state) => {
    const friendList = state.friends.friends;
    const filteredList: Friend[] = [];

    for (let i = 0; i < friendList.length; i++) {
      const friend = friendList[i];
      if (friend.status !== undefined && friend.status.state !== undefined && friend.status.state === "Blocked") filteredList.push(friend);
    }

    return filteredList;
  }
}
