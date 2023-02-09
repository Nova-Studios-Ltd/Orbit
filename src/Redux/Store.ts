import { AnyAction, AsyncThunkAction, configureStore, Selector, ThunkAction } from "@reduxjs/toolkit";

import appReducer from "Redux/Slices/AppSlice";
import chatReducer from "Redux/Slices/ChatSlice";
import consoleReducer from "Redux/Slices/ConsoleSlice";
import friendReducer from "Redux/Slices/FriendSlice";
import routeReducer from "Redux/Slices/RouteSlice";

const store = configureStore({
  reducer: {
    app: appReducer,
    chat: chatReducer,
    console: consoleReducer,
    friends: friendReducer,
    routing: routeReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>
export type AppSelector<ReturnType = void> = Selector<
  RootState,
  ReturnType,
  any
>
export type AppAsyncThunkConfig = {
  /** return type for `thunkApi.getState` */
  state: RootState
  /** type for `thunkApi.dispatch` */
  dispatch: AppDispatch
  /** type of the `extra` argument for the thunk middleware, which will be passed in as `thunkApi.extra` */
  extra?: unknown
  /** type to be passed into `rejectWithValue`'s first argument that will end up on `rejectedAction.payload` */
  rejectValue?: unknown
  /** return type of the `serializeError` option callback */
  serializedErrorType?: unknown
  /** type to be returned from the `getPendingMeta` option callback & merged into `pendingAction.meta` */
  pendingMeta?: unknown
  /** type to be passed into the second argument of `fulfillWithValue` to finally be merged into `fulfilledAction.meta` */
  fulfilledMeta?: unknown
  /** type to be passed into the second argument of `rejectWithValue` to finally be merged into `rejectedAction.meta` */
  rejectedMeta?: unknown
}

export default store;
