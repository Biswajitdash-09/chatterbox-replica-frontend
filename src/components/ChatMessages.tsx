
import { useEffect, useRef } from "react";
import { Message } from "@/types";
import { currentUser, findUserById, formatDate } from "@/data/mockData";
import MessageBubble from "./MessageBubble";
import { useChat } from "@/context/ChatContext";

interface ChatMessagesProps {
  messages: Message[];
  isGroup: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isGroup }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { activeChat } = useChat();
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Group messages by date
  const messagesByDate: { [date: string]: Message[] } = {};
  
  messages.forEach(message => {
    const date = formatDate(message.timestamp);
    if (!messagesByDate[date]) {
      messagesByDate[date] = [];
    }
    messagesByDate[date].push(message);
  });

  // Get typing users excluding current user
  const typingUsers = activeChat?.typingUsers
    ?.filter(id => id !== currentUser.id)
    .map(findUserById)
    .filter(Boolean) || [];

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-[#efeae2]">
      {Object.entries(messagesByDate).map(([date, msgs]) => (
        <div key={date}>
          <div className="flex justify-center mb-4">
            <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-600">
              {date}
            </span>
          </div>
          
          {msgs.map(message => {
            const isOwnMessage = message.senderId === currentUser.id;
            const sender = isGroup && !isOwnMessage ? findUserById(message.senderId) : null;
            
            return (
              <MessageBubble 
                key={message.id}
                message={message}
                isOwnMessage={isOwnMessage}
                sender={sender}
              />
            );
          })}
        </div>
      ))}
      
      {typingUsers.length > 0 && (
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
          <div className="flex items-center justify-center bg-white rounded-full p-2">
            <div className="flex space-x-1">
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
            </div>
          </div>
          <span>
            {typingUsers.length === 1 
              ? `${typingUsers[0]?.name} is typing...` 
              : `${typingUsers.length} people are typing...`}
          </span>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
