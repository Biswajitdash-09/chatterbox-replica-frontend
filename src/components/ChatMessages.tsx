
import { useEffect, useRef } from "react";
import { Message } from "@/types";
import { currentUser, findUserById, formatDate } from "@/data/mockData";
import MessageBubble from "./MessageBubble";

interface ChatMessagesProps {
  messages: Message[];
  isGroup: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isGroup }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
