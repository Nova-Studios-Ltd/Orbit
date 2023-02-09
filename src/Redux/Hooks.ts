import { TypedUseSelectorHook, useDispatch as useDispatchGeneric, useSelector as useSelectorGeneric } from "react-redux";
import { AppAsyncThunkConfig, AppDispatch, RootState } from "Redux/Store";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const useDispatch: () => AppDispatch = useDispatchGeneric;
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorGeneric;
export const createAppAsyncThunk = createAsyncThunk.withTypes<AppAsyncThunkConfig>();
