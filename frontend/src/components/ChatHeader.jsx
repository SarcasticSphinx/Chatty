import React, { useEffect, useState } from "react";

import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const ChatHeader = () => {
  const { onlineUsers } = useAuthStore();
  const { selectedUser, setSelectedUser } = useChatStore();

  return (
    <div className="chat-header flex items-center justify-between p-4 bg-base-200 text-base-content">
      <div className="flex items-center">
        <div className="relative w-12 h-12 mr-4">
          <img
            className="w-12 h-12 rounded-full mr-4 object-cover"
            src={
              selectedUser.profile_pic ? selectedUser.profile_pic : "avatar.png"
            }
            alt=""
          />
          <div
            className={`absolute size-3 rounded-full right-0 bottom-0 ${
              onlineUsers.includes(selectedUser._id)
                ? "bg-green-500 border-2 border-green-300"
                : ""
            }`}
          ></div>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-base-content">
            {selectedUser?.full_name}
          </h1>
          <p className="text-sm text-base-content">
            {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <button
        onClick={() => {
          setSelectedUser(null);
        }}
        className="btn text-sm md:text-xl"
      >
        ✖
      </button>
    </div>
  );
};

export default ChatHeader;
