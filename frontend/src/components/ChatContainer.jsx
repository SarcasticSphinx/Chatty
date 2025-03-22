import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import Loding from "./loding";
import ChatHeader from "./ChatHeader";
import SendMessageContainer from "./SendMessageContainer";
import { useAuthStore } from "../store/useAuthStore";
import { HourAndMinute } from "../utils/TimeFormat";
import { MessageSquareDiff } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    getMessages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser, socket } = useAuthStore();
  const messagesEndRef = useRef(null);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();

      return () => {
        unsubscribeFromMessages();
      };
    }
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Helper function to determine if message is from current user
  const sender = (message) => {
    return message.senderId === authUser._id;
  };

  return (
    <div className="flex flex-col h-full w-full">
      <ChatHeader />

      <div className="conversation h-full overflow-y-auto">
        {isMessagesLoading ? (
          <Loding />
        ) : (
          <div className="p-4 h-full overflow-y-auto z-[-1]">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message._id}
                  className={`chat ${
                    sender(message) ? "chat-end" : "chat-start"
                  }`}
                >
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt="avatar"
                        src={
                          sender(message)
                            ? authUser.profile_pic || "/avatar.png"
                            : selectedUser.profile_pic || "/avatar.png"
                        }
                        className="object-cover w-full h-full rounded-full"
                      />
                    </div>
                  </div>
                  <div className="chat-header z-[-1]">
                    <time className="text-xs opacity-50 ml-2 ">
                      {HourAndMinute({ date: new Date(message.createdAt) })}
                    </time>
                  </div>
                  <div
                    className={`chat-bubble z-[-1] ${
                      sender(message) ? "bg-accent text-base-200" : ""
                    }`}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt="chat"
                        className="sm:max-w-[200px] rounded-md object-cover"
                      />
                    )}
                    {message.text}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-full animate-pulse gap-2 text-gray-500">
                  <MessageSquareDiff className="size-12" />
                   <p className="text-xl font-semibold">Send something to Start a conversation</p>
              </div>
            )}
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <SendMessageContainer />
    </div>
  );
};

export default ChatContainer;
