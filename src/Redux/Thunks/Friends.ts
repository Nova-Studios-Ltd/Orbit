import { isValidUsername } from "NSLib/Util";
import { CREATEChannel, GETUserUUID, REQUESTFriend, ACCEPTFriend, REMOVEFriend, BLOCKFriend, UNBLOCKFriend, CREATEGroupChannel } from "NSLib/APIEvents";

import { Routes } from "Types/UI/Routing";
import type Friend from "Types/UI/Friend";
import { Dictionary } from "NSLib/Dictionary";
import { GETOwnFriends, GETUser } from "../../NSLib/APIEvents";

import { AppThunk } from "Redux/Store";
import { ChannelLoad, channelContainsUUID } from "Redux/Thunks/Channels";
import { addFriend } from "Redux/Slices/FriendSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { startDoingSomething, stopDoingSomething } from "Redux/Slices/AppSlice";

export const FriendsPopulate = createAsyncThunk("friends/populate", async (_, thunkAPI) => {
  thunkAPI.dispatch(startDoingSomething());
  const rawFriends: Dictionary<string> = await GETOwnFriends();

  for (let i = 0; i < rawFriends.keys().length; i++) {
    const friendUUID = rawFriends.keys()[i];
    const friendStatus = rawFriends.getValue(friendUUID);
    const friendData = await GETUser(friendUUID);
    const friend = { friendData, status: friendStatus };

    thunkAPI.dispatch(addFriend(friend));
  }

  thunkAPI.dispatch(stopDoingSomething());
})

export function FriendClicked(friend: Friend): AppThunk {
  return (dispatch, getState) => {
    const state = getState();

    if (friend.friendData && friend.friendData.uuid) {
      switch (friend.status?.toLowerCase()) {
        case "accepted":
          const existingChannel = dispatch(channelContainsUUID(friend.friendData.uuid, true));
          if (existingChannel) {
            dispatch(ChannelLoad(existingChannel));
          }
          else {
            CREATEChannel(friend.friendData.uuid, (status) => { console.log(`Channel creation from onFriendClicked status: ${status}`) });
          }
          break;
        case "request":
          ACCEPTFriend(friend.friendData.uuid);
          break;
      }
    }
  }
}

export function FriendCreateGroup(friends: Friend[]) {
  console.log(`Requested to create group with recipients ${friends}`);
  if (friends.length > 0) {
    let groupChannelName = "";
    const groupChannelRecipients: string[] = [];
    for (let i = 0; i < friends.length; i++) {
      const friend = friends[i];
      if (friend.friendData) {
        groupChannelName += `${friend.friendData.username}${i < friends.length - 1 ? ", " : ""}`;
        groupChannelRecipients.push(friend.friendData.uuid);
      }
    }

    CREATEGroupChannel(groupChannelName, groupChannelRecipients, (created) => {
      if (created) console.success(`Group channel successfully created`)
      else console.error(`Unable to create group channel`);
    });

    return;
  }
  console.warn(`Unable to create group channel because there were no recipients`);
}

export async function FriendAdd(recipient: string) {
  if (isValidUsername(recipient)) {
    const ud = recipient.split("#");
    const user = await GETUserUUID(ud[0], ud[1]);
    if (user === undefined) return 1;
    REQUESTFriend(user);
    return 0;
  }
  return 2;
};

export function FriendBlock(uuid: string) {
  BLOCKFriend(uuid);
  console.log(`Cockblocked user ${uuid}`);
}

export function FriendUnblock(uuid: string) {
  UNBLOCKFriend(uuid);
  console.log(`Uncockblocked user ${uuid}`);
}

export function FriendRemove(uuid: string) {
  REMOVEFriend(uuid);
}