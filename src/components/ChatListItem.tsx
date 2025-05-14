
import { cn } from "@/lib/utils";
import { Chat } from "@/types";
import { formatTime, findUserById, currentUser } from "@/data/mockData";
import Avatar from "./Avatar";

interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ 
  chat, 
  isActive,
  onClick
}) => {
  // For non-group chats, find the other user (not current user)
  const otherUser = chat.isGroup 
    ? null 
    : chat.participants.find(p => p.id !== currentUser.id);

  const lastMessage = chat.messages[chat.messages.length - 1];
  const lastMessageSender = findUserById(lastMessage.senderId);
  
  // Display name is either the group name or the other user's name
  const displayName = chat.isGroup ? chat.groupName : otherUser?.name;
  
  // Format the last message preview
  const lastMessageText = 
    lastMessage.senderId === currentUser.id 
      ? `You: ${lastMessage.text}` 
      : chat.isGroup 
        ? `${lastMessageSender?.name}: ${lastMessage.text}`
        : lastMessage.text;

  return (
    <div 
      className={cn(
        "flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100",
        isActive && "bg-gray-100"
      )}
      onClick={onClick}
    >
      <Avatar 
        user={chat.isGroup ? { id: chat.id, name: chat.groupName || "", avatar: chat.groupAvatar || "" } : otherUser} 
        showStatus={!chat.isGroup}
      />

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <span className="font-semibold truncate">{displayName}</span>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
            {formatTime(lastMessage.timestamp)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 truncate">{lastMessageText}</p>
          
          {chat.unreadCount > 0 && (
            <span className="ml-2 flex items-center justify-center bg-whatsapp-green text-white rounded-full w-5 h-5 text-xs">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
