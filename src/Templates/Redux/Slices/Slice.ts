import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SliceState {
  someValue: string,
  anotherValue: number
}

const initialState: SliceState = {
  someValue: "penis",
  anotherValue: 69
   // You can have multiple items defined here (think of the state as a dictionary)
}

export const Slice = createSlice({
  name: "slice",
  initialState,
  reducers: {
    changeSingleValue: (state, action: PayloadAction<string>) => { // Typically all you need to handle state updates
      // Do something to the state. For example...
      state.someValue = action.payload;
    },
    changeMultipleValues: { // Use this format when you need to pass in more than one argument
      reducer(state, action: PayloadAction<{ arg1: string, arg2: number }>) { // Same as before
        // Do something to the state. For example...
        state.someValue = action.payload.arg1;
        state.anotherValue = action.payload.arg2;
      },
      prepare(arg1: string, arg2: number) { // You essentially take the multiple arguments and combine them into a single payload here (you can have more than 2 args as well)
        return {
          payload: { arg1, arg2 }
        }
      }
    }
  }
});

export const { changeSingleValue, changeMultipleValues } = Slice.actions; // State update handlers
export default Slice.reducer; // No touchy
