import { useState, useEffect, useRef } from "react";
import {
  Textarea,
  IconButton,
  Navbar,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Dialog,
  Button,
  Badge,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  EllipsisVerticalIcon,
  TrashIcon,
  PaperAirplaneIcon
} from "@heroicons/react/24/solid";
import { useWebSocket } from "@/services/WebSocketService";
import { getUserFromToken } from "@/utils/auth";

export function ChatArea({ user }) {
  const { sendMessage, messages, clearMessages, fetchMessages } = useWebSocket();
  const [messageContent, setMessageContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const LoggedUser = getUserFromToken();

  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (messageContent.trim()) {
      sendMessage(LoggedUser.userId, user.id, messageContent);
      setMessageContent("");
    }
  };

  useEffect(() => {
    if (LoggedUser?.userId && user) {
      fetchMessages(LoggedUser.userId, user.id);
    }
  }, [LoggedUser?.userId, user?.id]);

  useEffect(() => {
    // Desplazar automáticamente hacia el final cuando se renderizan nuevos mensajes
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  let filteredMessages = [];

  if (LoggedUser?.userId && user) {
    filteredMessages = messages.filter(
      (msg) =>
        (msg.senderId === LoggedUser.userId && msg.receiverId === user.id) ||
        (msg.senderId === user.id && msg.receiverId === LoggedUser.userId)
    );
  }

    // Función para abrir el modal
    const openModal = () => {
      setIsModalOpen(true);
    };
  
    // Función para cerrar el modal
    const closeModal = () => {
      setIsModalOpen(false);
    };
  
    // Función para confirmar y limpiar el chat
    const confirmClearChat = () => {
      clearMessages(LoggedUser.userId, user.id);
      closeModal();
    };

  return (
    <div className="flex flex-col w-full h-screen">
      <Navbar
        color="bg-main"
        className="flex items-center px-4 py-2 mx-auto rounded-none border-blue-gray-800 bg-main max-w-screen-3xl lg:px-8 lg:py-4"
      >
        <div className="flex items-center flex-1">

                <UserCircleIcon className="w-10 h-10" />
          <span className="text-lg text-white ml-2">{user.name}</span>
        </div>
        <Menu placement="bottom-start">
          <MenuHandler>
            <IconButton
              variant="text"
              className="text-white ml-auto hover:bg-gray-500"
              aria-label="Settings"
            >
              <EllipsisVerticalIcon className="w-6 h-6" />
            </IconButton>
          </MenuHandler>
          <MenuList className="bg-main border border-blue-gray-800 text-white">
            <MenuItem
              className="flex items-center"
              onClick={openModal}
            >
              <TrashIcon className="w-4 h-4 mr-2 text-white" />
              Limpiar Chat
            </MenuItem>
          </MenuList>
        </Menu>
      </Navbar>
      <div className="flex flex-col flex-1 h-auto p-8 overflow-y-auto border-t border-b border-blue-gray-900 bg-main">
        {/* Mostrar mensajes */}
        {filteredMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.senderId === LoggedUser.userId
                ? "justify-end"
                : "justify-start"
            } mb-2`}
          >
            <div
              className={`flex flex-col max-w-md rounded-lg ${
                msg.senderId === LoggedUser.userId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              <p className="p-2">{msg.content}</p>
            </div>
            <br />
            <span className={`text-xs text-gray-400 mt-1 ml-2 self-end`}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}

        <div ref={messagesEndRef} />
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
            className="text-white rounded-full hover:bg-gray-500"
            onClick={handleSend}
          >
            <PaperAirplaneIcon className="w-6 h-6"/>
          </IconButton>
        </div>
      </div>

      <Dialog
        open={isModalOpen}
        handler={closeModal}
        size="sm"
        className="bg-gray-800 text-white "
      >
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Confirmar acción</h3>
          <p>¿Estás seguro de que quieres limpiar el chat? Los mensajes se eliminarán también para el otro usuario.</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              color="red"
              onClick={confirmClearChat}
            >
              Confirmar
            </Button>
            <Button
              color="gray"
              onClick={closeModal}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default ChatArea;
