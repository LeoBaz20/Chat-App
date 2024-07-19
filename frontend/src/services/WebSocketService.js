"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { getToken } from '@/utils/auth';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const token = getToken();
    if (token && !socket) {
      authenticate(token);
    }
    return disconnect;
  }, []);

  const authenticate = (token) => {
    const wsUrl = 'ws://localhost:3002';
    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => {
      console.log('Conectado al WebSocket');
      const authMessage = JSON.stringify({
        type: 'authenticate',
        token: token,
      });
      newSocket.send(authMessage);
    };

    newSocket.onmessage = handleIncomingMessage;

    newSocket.onclose = () => {
      console.log('Desconectado del WebSocket');
      setIsAuthenticated(false);
      setConnectedUsers([]);
    };

    newSocket.onerror = (error) => {
      console.error('Error en WebSocket:', error);
    };

    if (socket) {
      socket.close();
    }

    setSocket(newSocket);
  };

  const handleIncomingMessage = (event) => {
    const message = JSON.parse(event.data);
    switch (message.type) {
      case 'authenticated':
        console.log('Autenticado correctamente:', message.message);
        setIsAuthenticated(true);
        break;
      case 'error':
        console.error('Error:', message.message);
        break;
      case 'connectedUsers':
        setConnectedUsers(message.users);
        break;
      case 'privateMessage':
        setMessages((prevMessages) => [
          ...prevMessages,
        { from: message.from, content: message.content, timestamp: message.timestamp }, // Incluir timestamp en el estado local
        ]);
        break;
      default:
        console.log('Mensaje del servidor:', message);
        break;
    }
  };

  const disconnect = () => {
    if (socket) {
      socket.close();
      console.log('Conexión WebSocket cerrada');
      setSocket(null);
      setIsAuthenticated(false);
    }
  };

  const sendMessage = (senderId, targetUserId, content) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = {
        type: 'privateMessage',
        senderId,
        targetUserId,
        content,
        timestamp: new Date().toISOString()  // Agregar timestamp actual
      };
      socket.send(JSON.stringify(message));
      
      setMessages((prevMessages) => [
        ...prevMessages,
        { from: senderId, content, timestamp: message.timestamp },  // Agregar timestamp a los mensajes locales
      ]);
    } else {
      console.error('WebSocket no está abierto');
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const contextValue = {
    socket,
    isAuthenticated,
    connectedUsers,
    messages,
    authenticate,
    disconnect,
    sendMessage,
    clearMessages,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
