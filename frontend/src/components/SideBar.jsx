import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./SideBarSkeleton";
import Loding from "./loding";
import { Contact } from "lucide-react";

const SideBar = () => {
  const { users, isUsersLoding, sideBarUsers, setSelectedUser } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    sideBarUsers();
  }, [sideBarUsers]);

  if (isUsersLoding) {
    return (
      <div className="w-full md:w-1/4 h-full">
        <SidebarSkeleton />
      </div>
    );
  }

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  return (
    <div className="bg-base-200 p-4 h-full w-fit md:w-1/4">
      <div className="space-y-2">
        <div className="flex items-center justify-center md:justify-start md:gap-3 md:p-3 py-3 border-b-2 border-base-600">
          <Contact className="size-10 md:size-6" />
          <h1 className="text-2xl font-bold hidden md:block">Contacts</h1>
        </div>

        {/* Toggle for online users */}
        <div className="items-center gap-2 p-2 hidden md:flex">
          <input
            type="checkbox"
            id="onlineOnly"
            checked={showOnlineOnly}
            onChange={() => setShowOnlineOnly((prev) => !prev)}
            className="cursor-pointer"
          />
          <label
            htmlFor="onlineOnly"
            className="cursor-pointer"
          >
            Online Users 
          </label>
        </div>

        {/* Users List */}
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center md:gap-3 md:p-3 rounded-lg hover:bg-base-300 cursor-pointer"
              onClick={() => setSelectedUser(user)}
            >
              <div className="relative w-10 h-10">
                <img
                  src={user.profile_pic || "/avatar.png"}
                  alt={user.full_name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-accent-400"
                />
                <div
                  className={`absolute size-3 rounded-full right-0 bottom-0 ${
                    onlineUsers.includes(user._id)
                      ? "bg-green-500 border-2 border-green-300"
                      : ""
                  }`}
                ></div>
              </div>
              <div>
                <p className="font-medium hidden md:block">{user.full_name}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">
            No {showOnlineOnly ? "online " : ""}users found.
          </p>
        )}
      </div>
    </div>
  );
};

export default SideBar;
