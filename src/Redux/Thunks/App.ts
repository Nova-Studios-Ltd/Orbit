import { createAsyncThunk } from "@reduxjs/toolkit";
import { SHA256 } from "Lib/Encryption/Util";

export const generateSessionString = createAsyncThunk("chat/generateSessionString", async () => {
  return (await SHA256(Date.now().toString())).Base64;
});
