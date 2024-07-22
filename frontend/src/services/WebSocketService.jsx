"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { getToken } from '@/utils/auth';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const token = getToken();

  useEffect(() => {
    if (token && !socket) {
      authenticate(token);
    }
    return disconnect;
  }, []);

  const authenticate = (token) => {
    const wsUrl = 'ws://${}/8000';
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
        { senderId: message.from, receiverId: message.to, content: message.content, timestamp: message.timestamp }, // Incluir timestamp en el estado local
        ]);
        break;
      default:
        console.log('Mensaje del servidor:', message);
        break;
    }
  };

  const fetchMessages = async (senderId, targetUserId) => {
    try {
      const response = await fetch(`https://chat-app-8s32.onrender.com/api/messages/getMessages?senderId=${senderId}&targetUserId=${targetUserId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error fetching messages');
      }
  
      const messages = await response.json();
      setMessages(messages);
    } catch (error) {
      console.error(error);
      alert('Error fetching messages');
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

  const sendMessage = (senderId, receiverId, content) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = {
        type: 'privateMessage',
        senderId,
        receiverId,
        content,
        timestamp: new Date().toISOString()  // Agregar timestamp actual
      };
      socket.send(JSON.stringify(message));
      
      setMessages((prevMessages) => [
        ...prevMessages,
        { senderId, receiverId, content, timestamp: message.timestamp },  // Agregar timestamp a los mensajes locales
      ]);
    } else {
      console.error('WebSocket no está abierto');
    }
  };

  const clearMessages = async (senderId, targetUserId) => {
    try {
      const response = await fetch(`https://${process.env.REACT_APP_HOST}:8000/api/messages/deleteMessages?senderId=${senderId}&targetUserId=${targetUserId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error deleting messages');
      }
      setMessages([]);
    } catch (error) {
      console.error(error);
      alert('Error deleting messages');
    }
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
    fetchMessages
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
