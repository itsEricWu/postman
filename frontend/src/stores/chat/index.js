import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    image: "a",
    otherUser: "b",
    otherUserName: "c",
    users: [],
  },
  reducers: {
    setImage: (state, action) => { 
      state.image = action.payload;
    },
    setOtherUser: (state, action) => {
      state.otherUser = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setOtherUserName: (state, action) => {
      state.otherUserName = action.payload;
    }
  }
});

export const {
  setImage,
  setOtherUser,
  setUsers,
  setOtherUserName,
} = chatSlice.actions;


export default chatSlice.reducer;