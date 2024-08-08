import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chats: [],
  messages: [],
  currentChat: null,
  messagesLoading: false,
  chatInitialized: false,
  authUserId: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats(state, action) {
      state.chats = action.payload;
    },
    updateChat(state, action) {
      const { payload } = action;
      const staledChatItemIndex = state.chats.findIndex(
        (item) => item.chatId === payload.chatId,
      );
      state.chats[staledChatItemIndex] = {
        ...state.chats[staledChatItemIndex],
        ...payload,
      };
    },
    removeChat(state, action) {
      const { payload: chatId } = action;
      const removedChatItemIndex = state.chats.findIndex(
        (item) => item.chatId === chatId,
      );
      state.chats.splice(removedChatItemIndex, 1);
    },
    addChat(state, action) {
      state.chats.push(action.payload);
    },
    setMessages(state, action) {
      state.messages = action.payload;
    },
    setCurrentChat(state, action) {
      state.currentChat = action.payload;
    },
    removeCurrentChat(state) {
      state.currentChat = null;
    },
    setMessagesLoading(state, action) {
      state.messagesLoading = action.payload;
    },
    setChatInitialized(state, action) {
      state.chatInitialized = action.payload;
    },
    setAuthUserId(state, action) {
      state.authUserId = action.payload;
    },
  },
});

export const {
  setChats,
  setMessages,
  setCurrentChat,
  removeCurrentChat,
  updateChat,
  removeChat,
  addChat,
  setMessagesLoading,
  setChatInitialized,
  setAuthUserId,
} = chatSlice.actions;
export default chatSlice.reducer;
