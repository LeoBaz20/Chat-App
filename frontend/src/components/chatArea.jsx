"use client";

import { useState, useEffect } from "react";
import { Textarea, IconButton, Navbar } from "@material-tailwind/react";
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useWebSocket } from "@/services/WebSocketService";
import { getUserFromToken } from "@/utils/auth";

export function ChatArea({ user }) {
  const { sendMessage, messages, clearMessages } = useWebSocket();
  const [messageContent, setMessageContent] = useState('');
  const LoggedUser = getUserFromToken();

  useEffect(() => {
    clearMessages(); // Limpiar el campo de entrada al cambiar de usuario
  }, [user]);

  const handleSend = () => {
    if (messageContent.trim()) {
      sendMessage(LoggedUser.userId, user.id, messageContent);
      setMessageContent('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col w-full h-screen">
      <Navbar color="bg-main" className="flex items-center px-4 py-2 mx-auto rounded-none border-blue-gray-800 bg-main max-w-screen-3xl lg:px-8 lg:py-4">
        <UserCircleIcon className="w-10 h-10 mr-2 text-white" />
        <span className="text-lg text-white">{user.name}</span>
      </Navbar>
      <div className="flex flex-col flex-1 h-auto p-8 overflow-y-auto border-t border-b border-blue-gray-900 bg-main">
  {/* Mostrar mensajes */}
  {messages.map((msg, index) => (
    <div key={index} className={`flex justify-${msg.from === LoggedUser.userId ? 'end' : 'start'} mb-2`}>
      <div className={`flex flex-col max-w-md rounded-lg ${msg.from === LoggedUser.userId ? 'bg-blue-500 text-white self-end' : 'bg-gray-700 text-white self-start'}`}>
        <p className="p-2">{msg.content}</p>
      </div>
      <br/>
      <span className={`text-xs text-gray-400 mt-1 ml-2 self-end`}>
        {new Date(msg.timestamp).toLocaleTimeString()}
      </span>
    </div>
  ))}
</div>


      <div className="flex flex-row items-center w-full gap-2 p-2 bg-main">
        <Textarea
          rows={1}
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          onKeyDown={handleKeyDown}
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
