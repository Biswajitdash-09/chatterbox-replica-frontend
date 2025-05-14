
import { useState } from "react";
import { MessageSquare, Users, Phone, MoreVertical, Search } from "lucide-react";
import { Chat } from "@/types";
import Avatar from "./Avatar";
import ChatListItem from "./ChatListItem";
import { currentUser } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SidebarProps {
  chats: Chat[];
  activeChat: Chat | null;
  onChatSelect: (chat: Chat) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ chats, activeChat, onChatSelect }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const filteredChats = chats.filter(chat => {
    const otherUser = chat.participants.find(p => p.id !== currentUser.id);
    const displayName = chat.isGroup ? chat.groupName : otherUser?.name;
    
    return displayName?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full border-r">
      {/* Header */}
      <div className="flex justify-between items-center p-3 bg-white">
        <Avatar user={currentUser} />
        
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" className="rounded-full text-gray-600">
            <Users className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full text-gray-600">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full text-gray-600">
            <Phone className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full text-gray-600">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Search */}
      <div className="px-3 py-2 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-100"
          />
        </div>
      </div>
      
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map(chat => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            isActive={activeChat?.id === chat.id}
            onClick={() => onChatSelect(chat)}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
