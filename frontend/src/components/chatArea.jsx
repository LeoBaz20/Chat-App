"use client";

import { useState, useEffect } from "react";
import { Textarea, IconButton, Navbar } from "@material-tailwind/react";
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useWebSocket } from "@/services/WebSocketService";
import { getUserFromToken } from "@/utils/auth";

export function ChatArea({ user }) {
  const { sendMessage, socket } = useWebSocket();
  const [messageContent, setMessageContent] = useState('');
  const [messages, setMessages] = useState([]);
  const LoggedUser = getUserFromToken();

  useEffect(() => {
    setMessages([]); // Limpiar mensajes cuando cambia el usuario
  }, [user]);

  const handleSend = () => {
    if (messageContent.trim()) {
      // Enviar el mensaje con senderId y receiverId
      sendMessage(LoggedUser.userId, user.id, messageContent);
  
      // Agregar el mensaje enviado al estado local
      setMessages((prevMessages) => [
        ...prevMessages,
        { from: LoggedUser.userId, content: messageContent },
      ]);
  
      setMessageContent(''); // Limpiar el campo de entrada
    }
  };

  useEffect(() => {
    const handleIncomingMessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'privateMessage') {
        setMessages((prevMessages) => [
          ...prevMessages,
          { from: message.from, content: message.content },
        ]);
      }
    };

    if (socket) {
      socket.addEventListener('message', handleIncomingMessage);
    }

    return () => {
      if (socket) {
        socket.removeEventListener('message', handleIncomingMessage);
      }
    };
  }, [socket]);

  return (
    <div className="flex flex-col w-full h-screen">
      <Navbar color="bg-main" className="flex items-center px-4 py-2 mx-auto border-l rounded-none border-blue-gray-800 bg-main max-w-screen-3xl lg:px-8 lg:py-4">
        <UserCircleIcon className="w-10 h-10 mr-2 text-white" />
        <span className="text-lg text-white">{user.name}</span>
      </Navbar>
      <div className="flex flex-col flex-1 h-auto p-4 overflow-y-auto border border-blue-gray-900 bg-main">
        {/* Mostrar mensajes */}
        {messages.map((msg, index) => (
          <div key={index} className={`flex justify-${msg.from === LoggedUser.userId ? 'end' : 'start'} mb-2`}>
            <div className={`p-2 text-white rounded-lg ${msg.from === LoggedUser.userId ? 'bg-blue-500' : 'bg-gray-700'}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-row items-center w-full gap-2 p-2 border-l bg-main border-blue-gray-800">
        <Textarea
          rows={1}
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          resize={false}
          placeholder="Your Message"
          className="min-h-full text-white !border-0 focus:border-blue-500"
          containerProps={{
            className: "grid h-full",
          }}
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />
        <div>
          <IconButton
            variant="text"
            className="text-white rounded-full"
            onClick={handleSend}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default ChatArea;
