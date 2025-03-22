import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE==='development' ? 'http://localhost:8000/api' : '/api'

export const useAuthStore = create((set, get) => ({
  authUser: null,
  error: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      set({
        authUser: res.data,
        error: null,
      });
      get().connectSocket();
    } catch (error) {
      console.log("Auth check error:", error.response?.data || error.message);
      set({
        authUser: null,
        error: error.response?.data?.message || "Authentication failed",
      });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signUp", data);
      set({
        authUser: res.data,
        error: null,
      });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      console.log("error in Auth in store: ", error);
      const errorMessage =
        error.response?.data?.message || "Account creation failed";
      toast.error(errorMessage);
      set({ error: errorMessage });
    } finally {
      set({ isSigningUp: false });
    }
  },

  logIn: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/logIn", data);
      set({
        authUser: res.data,
        error: null,
      });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      console.log("Login error:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logOut: async () => {
    try {
      await axiosInstance.post("/auth/logOut");
      set({
        authUser: null,
        error: null,
      });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      console.log("Logout error:", error.response?.data || error.message);
      toast.error("Logout failed");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update", {
        profile_pic: data.profilePic,
      });
      set({
        authUser: {
          ...res.data,
          profile_pic: res.data.profile_pic,
        },
        error: null,
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log(
        "Update profile error:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },

  
}));
