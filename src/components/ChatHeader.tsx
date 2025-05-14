
import { Search, MoreVertical, Phone, Video } from "lucide-react";
import Avatar from "./Avatar";
import { User, Chat } from "@/types";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  activeChat: Chat | null;
  activeChatUser: User | null;
  onInfoToggle: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  activeChat, 
  activeChatUser,
  onInfoToggle
}) => {
  const isGroup = activeChat?.isGroup;
  const displayName = isGroup 
    ? activeChat?.groupName 
    : activeChatUser?.name;
  
  const statusText = isGroup
    ? `${activeChat?.participants.length || 0} participants`
    : activeChatUser?.isOnline
      ? "Online"
      : activeChatUser?.lastSeen
        ? `Last seen ${activeChatUser.lastSeen}`
        : "";

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
      <div className="flex items-center gap-3 cursor-pointer" onClick={onInfoToggle}>
        <Avatar 
          user={isGroup ? null : activeChatUser} 
          showStatus={true}
        />
        <div>
          <h3 className="font-semibold">{displayName}</h3>
          <p className="text-xs text-gray-500">{statusText}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button size="icon" variant="ghost" className="rounded-full text-gray-600">
          <Video className="h-5 w-5" />
        </Button>
        <Button size="icon" variant="ghost" className="rounded-full text-gray-600">
          <Phone className="h-5 w-5" />
        </Button>
        <Button size="icon" variant="ghost" className="rounded-full text-gray-600">
          <Search className="h-5 w-5" />
        </Button>
        <Button size="icon" variant="ghost" className="rounded-full text-gray-600">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
