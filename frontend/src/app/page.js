"use client";

import React, { useState, useEffect } from "react";
import SideBar from "@/components/SideBar";
import Welcome from "@/components/welcome";
import ChatArea from "@/components/chatArea";
import { getToken } from "@/utils/auth";
import { redirect } from "next/navigation";

export default function App() {
  const [selectedUser, setSelectedUser] = useState(null);
  const token = getToken();

  useEffect(()=>{
    if(!token){
      redirect("/login");
    }
  },[]);


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

