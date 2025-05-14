
import { Message, User } from "@/types";
import { formatTime } from "@/data/mockData";
import { Check, CheckCheck, Trash2, File as FileIcon } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import EmojiPicker from "./EmojiPicker";
import { currentUser } from "@/data/mockData";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
  const [showActions, setShowActions] = useState(false);
  const { addReaction, deleteMessage } = useChat();
  
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

  const handleReaction = (emoji: string) => {
    addReaction(message.id, emoji);
  };

  const handleDelete = () => {
    if (isOwnMessage) {
      deleteMessage(message.id);
    }
  };

  const hasMedia = message.media && message.media.length > 0;

  return (
    <div className={`flex mb-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] relative ${
          isOwnMessage ? 'message-bubble-outgoing' : 'message-bubble-incoming'
        }`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {!isOwnMessage && sender && (
          <div className="text-xs font-medium text-whatsapp-teal mb-1">
            {sender.name}
          </div>
        )}
        
        {hasMedia && (
          <div className="mb-2 space-y-2">
            {message.media?.map((item, index) => (
              <div key={index} className="rounded-md overflow-hidden">
                {item.type === 'image' ? (
                  <AspectRatio ratio={4/3}>
                    <img 
                      src={item.url} 
                      alt={item.name || "Media"} 
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                ) : (
                  <div className="bg-gray-100 p-3 rounded-md flex items-center gap-2">
                    <FileIcon className="h-6 w-6 text-gray-500" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      {item.size && (
                        <p className="text-xs text-gray-500">{item.size}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {(message.text || !hasMedia) && (
          <div className={`break-words ${message.isDeleted ? 'italic text-gray-500' : ''}`}>
            {message.text || (message.isDeleted ? "This message was deleted" : "Media message")}
          </div>
        )}
        
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex items-center bg-white rounded-full px-2 py-1 mt-1 w-fit shadow-sm">
            {message.reactions.map((reaction, index) => (
              <span key={index} className="text-sm">{reaction.emoji}</span>
            ))}
            <span className="text-xs text-gray-500 ml-1">{message.reactions.length}</span>
          </div>
        )}
        
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[10px] text-gray-500">{formatTime(message.timestamp)}</span>
          {isOwnMessage && statusIcon()}
        </div>
        
        {showActions && !message.isDeleted && (
          <div className="absolute top-0 right-0 -translate-y-full bg-white rounded-lg shadow-md p-1 flex items-center">
            <EmojiPicker onEmojiSelect={handleReaction} />
            
            {isOwnMessage && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-red-500"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
