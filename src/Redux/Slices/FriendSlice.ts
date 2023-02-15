import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import Friend from "Types/UI/Friend";

export interface FriendSliceState {
  friends: Friend[]
}

const initialState: FriendSliceState = {
  friends: []
}

export const FriendSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    addFriend: (state, action: PayloadAction<Friend>) => {
      if (action.payload !== undefined && action.payload.friendData !== undefined && action.payload.status !== undefined) {
        const target = state.friends.findIndex((friend) => friend.friendData?.uuid === action.payload.friendData?.uuid);

        if (target > -1) {
          state.friends[target] = action.payload;
        }
        else {
          state.friends.push(action.payload);
        }
      }
    },
    removeFriendByID: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload === undefined) {
        state.friends.pop();
      }
      else {
        const findIndex = state.friends.findIndex(friend => friend.friendData?.uuid === action.payload);
        if (findIndex > -1) state.friends.splice(findIndex, 1);
      }
    },
    removeFriendByValue: (state, action: PayloadAction<Friend | undefined>) => {
      if (action.payload === undefined) {
        state.friends.pop();
      }
      else {
        const findIndex = state.friends.findIndex(friend => friend.friendData?.uuid === action.payload?.friendData?.uuid);
        if (findIndex > -1) state.friends.splice(findIndex, 1);
      }
    },
    clearFriends: (state) => {
      return initialState;
    }
  }
});

export const { addFriend, clearFriends, removeFriendByID, removeFriendByValue } = FriendSlice.actions;
export default FriendSlice.reducer;
