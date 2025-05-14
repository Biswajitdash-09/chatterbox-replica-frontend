
import { Message, User } from "@/types";
import { formatTime } from "@/data/mockData";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  sender?: User | null;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isOwnMessage,
  sender
}) => {
  const statusIcon = () => {
    switch (message.status) {
      case "sent":
        return <Check className="h-3 w-3 text-gray-500" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-500" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex mb-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] ${
          isOwnMessage ? 'message-bubble-outgoing' : 'message-bubble-incoming'
        }`}
      >
        {!isOwnMessage && sender && (
          <div className="text-xs font-medium text-whatsapp-teal mb-1">
            {sender.name}
          </div>
        )}
        
        <div className="break-words">{message.text}</div>
        
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[10px] text-gray-500">{formatTime(message.timestamp)}</span>
          {isOwnMessage && statusIcon()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
