import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoding: false,
  isMessagesLoading: false,
  isSendingMessage: false,

  setSelectedUser: (user) => set({ selectedUser: user }),

  sideBarUsers: async () => {
    set({ isUsersLoding: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error("this is an error");
    } finally {
      set({ isUsersLoding: false });
    }
  },

  getUser: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error("error fetching messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (message) => {
    set({ isSendingMessage: true });
    const { selectedUser } = get();
    try {
      await axiosInstance.post(`/messages/send/${selectedUser._id}`, message);
      await get().getMessages(selectedUser._id);
    } catch (error) {
      toast.error("error sending message");
    } finally {
      set({ isSendingMessage: false });
    }
  },

  // In useChatStore.js
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const { socket } = useAuthStore.getState();
    if (!socket) return;

    // First unsubscribe to avoid duplicate listeners
    get().unsubscribeFromMessages();

    // Then add new listener
    socket.on("newMessage", (message) => {
      // Ensure we only update for the currently selected user
      if (
        message.senderId === selectedUser._id ||
        message.receiverId === selectedUser._id
      ) {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const { socket } = useAuthStore.getState();
    if (socket) {
      socket.off("newMessage");
    }
  },
}));
