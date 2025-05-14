
import { useState } from "react";
import { MessageSquare, Users, Phone, MoreVertical, Search, Archive, Star } from "lucide-react";
import { Chat } from "@/types";
import Avatar from "./Avatar";
import ChatListItem from "./ChatListItem";
import { currentUser } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RecentCalls from "./RecentCalls";
import Community from "./Community";
import { useChat } from "@/context/ChatContext";

interface SidebarProps {
  chats: Chat[];
  activeChat: Chat | null;
  onChatSelect: (chat: Chat) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ chats, activeChat, onChatSelect }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showArchivedChats, setShowArchivedChats] = useState(false);
  const [showFavoriteChats, setShowFavoriteChats] = useState(false);
  const [showRecentCalls, setShowRecentCalls] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  
  const filteredChats = chats.filter(chat => {
    const otherUser = chat.participants.find(p => p.id !== currentUser.id);
    const displayName = chat.isGroup ? chat.groupName : otherUser?.name;
    
    // Filter by search query
    const matchesQuery = displayName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by archived status if showing archived
    if (showArchivedChats) {
      return matchesQuery && chat.isArchived;
    }
    
    // Filter by favorite status if showing favorites
    if (showFavoriteChats) {
      return matchesQuery && chat.isFavorite;
    }
    
    // Regular chats (not archived)
    return matchesQuery && !chat.isArchived;
  });

  return (
    <>
      <div className="flex flex-col h-full border-r">
        {/* Header */}
        <div className="flex justify-between items-center p-3 bg-white">
          <Avatar user={currentUser} />
          
          <div className="flex gap-2">
            <Button 
              size="icon" 
              variant="ghost" 
              className="rounded-full text-gray-600"
              onClick={() => setShowCommunity(true)}
            >
              <Users className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full text-gray-600">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="rounded-full text-gray-600"
              onClick={() => setShowRecentCalls(true)}
            >
              <Phone className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full text-gray-600">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex border-b px-3 py-1">
          <Button
            variant={showArchivedChats ? "default" : "ghost"}
            size="sm"
            className="text-xs mr-2"
            onClick={() => {
              setShowArchivedChats(!showArchivedChats);
              setShowFavoriteChats(false);
            }}
          >
            <Archive className="h-4 w-4 mr-1" />
            Archived
          </Button>
          <Button
            variant={showFavoriteChats ? "default" : "ghost"}
            size="sm"
            className="text-xs"
            onClick={() => {
              setShowFavoriteChats(!showFavoriteChats);
              setShowArchivedChats(false);
            }}
          >
            <Star className="h-4 w-4 mr-1" />
            Favorites
          </Button>
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
          {filteredChats.length > 0 ? (
            filteredChats.map(chat => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isActive={activeChat?.id === chat.id}
                onClick={() => onChatSelect(chat)}
              />
            ))
          ) : (
            <div className="text-center p-4 text-gray-500">
              {showArchivedChats 
                ? "No archived chats" 
                : showFavoriteChats 
                  ? "No favorite chats" 
                  : "No chats found"}
            </div>
          )}
        </div>
      </div>

      <RecentCalls isOpen={showRecentCalls} onClose={() => setShowRecentCalls(false)} />
      <Community isOpen={showCommunity} onClose={() => setShowCommunity(false)} />
    </>
  );
};

export default Sidebar;
