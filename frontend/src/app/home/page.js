"use client";

import React, { useState } from "react";
import SideBar from "@/components/SideBar";
import Welcome from "@/components/welcome";
import ChatArea from "@/components/chatArea";

export default function App() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex h-screen">
      <SideBar onSelectedUser={setSelectedUser} />
      <div className="flex flex-col flex-1">
        <div className="flex flex-col flex-1 overflow-hidden">
        {selectedUser ? (
          <ChatArea user={selectedUser} />
        ) : (
          <Welcome />
        )}
        </div>
      </div>
    </div>
  );
}

