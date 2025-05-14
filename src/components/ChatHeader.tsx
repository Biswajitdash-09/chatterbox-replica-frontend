
import { useState } from "react";
import { Search, MoreVertical, Phone, Video, Archive, Star, Users } from "lucide-react";
import Avatar from "./Avatar";
import { User, Chat } from "@/types";
import { Button } from "@/components/ui/button";
import { useChat } from "@/context/ChatContext";
import RecentCalls from "./RecentCalls";
import GroupManager from "./GroupManager";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

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
  const [showRecentCalls, setShowRecentCalls] = useState(false);
  const [showGroupManager, setShowGroupManager] = useState(false);
  const { makeCall, toggleArchive, toggleFavorite } = useChat();
  
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

  const handleAudioCall = () => {
    if (activeChat) {
      makeCall(activeChat.id, 'audio');
    }
  };

  const handleVideoCall = () => {
    if (activeChat) {
      makeCall(activeChat.id, 'video');
    }
  };

  const handleArchive = () => {
    if (activeChat) {
      toggleArchive(activeChat.id);
    }
  };

  const handleFavorite = () => {
    if (activeChat) {
      toggleFavorite(activeChat.id);
    }
  };

  const handleGroupManager = () => {
    setShowGroupManager(true);
  };

  return (
    <>
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
          <Button 
            size="icon" 
            variant="ghost" 
            className="rounded-full text-gray-600"
            onClick={() => setShowRecentCalls(true)}
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="rounded-full text-gray-600"
            onClick={handleVideoCall}
          >
            <Video className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full text-gray-600">
            <Search className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-full text-gray-600">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleArchive}>
                <Archive className="mr-2 h-4 w-4" />
                {activeChat?.isArchived ? "Unarchive chat" : "Archive chat"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleFavorite}>
                <Star className="mr-2 h-4 w-4" />
                {activeChat?.isFavorite ? "Remove from favorites" : "Add to favorites"}
              </DropdownMenuItem>
              {isGroup && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleGroupManager}>
                    <Users className="mr-2 h-4 w-4" />
                    Manage group
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <RecentCalls isOpen={showRecentCalls} onClose={() => setShowRecentCalls(false)} />
      <GroupManager isOpen={showGroupManager} onClose={() => setShowGroupManager(false)} />
    </>
  );
};

export default ChatHeader;
