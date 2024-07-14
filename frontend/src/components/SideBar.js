import React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  List,
  ListItem,
  Typography,
  Button,
} from "@material-tailwind/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { logout } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useWebSocket } from "@/services/WebSocketService";

export function SideBar() {
  const router = useRouter();
  const { disconnect, connectedUsers } = useWebSocket();

  const handleLogout = () => {
    logout();
    disconnect();
    router.push("/");
    console.log("Sesión cerrada");
  };

  return (
    <Card className="h-screen w-full max-w-[20rem] bg-regal-blue p-0 shadow-xl rounded-none shadow-blue-gray-900/5">
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold text-white">CHAT-APP</h1>
      </div>
      <List className="relative">
        {connectedUsers.map((user, index) => (
          <ListItem
            key={index}
            className="relative flex items-center px-4 py-2 text-white border-b border-gray-700"
          >
            <UserCircleIcon className="w-12 h-12 mr-2 text-white" />
            <div className="flex-1">
              <Typography className="font-semibold text-white">
                {user.name}
              </Typography>
              <Typography className="text-sm text-gray-400">
                {user ? "Conectado" : "Desconectado"}
              </Typography>
            </div>
            {user && (
              <span className="absolute block w-3 h-3 transform -translate-y-1/2 bg-green-400 rounded-full top-1/2 right-4" />
            )}
          </ListItem>
        ))}
      </List>
      <div className="absolute w-full p-4 bottom-4">
        <Button onClick={handleLogout} color="red" className="w-full">
          Cerrar Sesión
        </Button>
      </div>
    </Card>
  );
}

export default SideBar;
