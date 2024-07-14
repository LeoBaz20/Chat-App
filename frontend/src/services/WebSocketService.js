"use client";

import { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);

  const authenticate = (token) => {
    const wsUrl = 'ws://localhost:3002';
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('Conectado al WebSocket');
      const authMessage = JSON.stringify({
        type: 'authenticate',
        token: token,
      });
      socket.send(authMessage);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'authenticated') {
        console.log('Autenticado correctamente:', message.message);
        setIsAuthenticated(true);
      } else if (message.type === 'error') {
        console.error('Error:', message.message);
      } else if (message.type === 'connectedUsers') {
        setConnectedUsers(message.users);
      } else {
        console.log('Mensaje del servidor:', message);
      }
    };

    socket.onclose = () => {
      console.log('Desconectado del WebSocket');
      setIsAuthenticated(false);
      setConnectedUsers([]);
    };

    socket.onerror = (error) => {
      console.error('Error en WebSocket:', error);
    };

    setSocket(socket);
  };

  const disconnect = () => {
    if (socket) {
      socket.close();
      console.log('Conexión WebSocket cerrada');
      setSocket(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, isAuthenticated, connectedUsers, authenticate, disconnect }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
