import React from "react";
import { useChatStore } from "../store/useChatStore";
import SideBar from "../components/SideBar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser, isUsersLoding, isMessagesLoading } = useChatStore();

  return (
    <div className="flex justify-between h-full overflow-hidden">
      <SideBar />
      <div className="w-full h-full">
        {selectedUser ? <ChatContainer /> : <NoChatSelected />}
      </div>
    </div>
  );
};

export default HomePage;
