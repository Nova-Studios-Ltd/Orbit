import { createAsyncThunk } from "@reduxjs/toolkit";
import { GenerateBase64SHA256 } from "NSLib/NCEncryption";

export const generateSessionString = createAsyncThunk("chat/generateSessionString", async () => {
  return (await GenerateBase64SHA256(Date.now().toString())).Base64;
});
