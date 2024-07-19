"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  List,
  ListItem,
  Typography,
  Button,
  IconButton,
  Badge,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { getUserFromToken, logout, getToken } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useWebSocket } from "@/services/WebSocketService";

export function SideBar({ onSelectedUser }) {
  const router = useRouter();
  const { disconnect, connectedUsers } = useWebSocket();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const handleLogout = () => {
    logout();
    disconnect();
    router.push("/login");
    console.log("Sesión cerrada");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const LoggedUser = getUserFromToken();
  const filteredUsers = connectedUsers.filter((connectedUser) => {
    // Verifica si LoggedUser es nulo o undefined
    if (!LoggedUser || LoggedUser.userId == null) {
      // Si LoggedUser o userId es nulo, retorna true para mantener todos los usuarios
      return true;
    }
    // Filtra usuarios normalmente si LoggedUser.userId no es nulo
    return connectedUser.id !== LoggedUser.userId;
  });
  

  return (
    <div className="flex h-screen">
      <Card
        className={`relative h-full bg-main border-r border-blue-gray-800 p-0 shadow-xl rounded-none transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-44"
        } lg:translate-x-0 lg:w-full lg:max-w-[20rem]`}
      >
        <div className="flex items-center justify-between p-4 text-center">
          <h1 className="text-2xl font-bold text-white">CHAT-APP</h1>
          <IconButton onClick={toggleSidebar} className="lg:hidden">
            {isSidebarOpen ? (
              <XMarkIcon className="w-6 h-6 text-white" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-white" />
            )}
          </IconButton>
        </div>
        <List className="relative">
          {filteredUsers.map((user, index) => (
            <ListItem
              key={index}
              className="relative flex items-center px-4 py-2 text-white rounded-none border-blue-gray-800 hover:bg-gray-700 focus:bg-blue-500"
              onClick={() => onSelectedUser(user)}
            >
              <Badge
                placement="bottom-end"
                overlap="circular"
                color="green"
                withBorder
              >
                <UserCircleIcon className="w-12 h-12"/>
              </Badge>
              <div className="flex-1 ml-3">
                <Typography className="font-semibold text-white">
                  {user.name}
                </Typography>
                <Typography className="text-sm text-gray-400">
                  {user ? "Conectado" : "Desconectado"}
                </Typography>
              </div>
            </ListItem>
          
          ))}
        </List>
        <div className="absolute w-full p-4 bottom-4">
          <Button onClick={handleLogout} color="red" className="w-full">
            Cerrar Sesión
          </Button>
        </div>
      </Card>
      <div
        className={`flex-1 transition-transform duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
      </div>
    </div>
  );
}

export default SideBar;
