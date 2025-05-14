
import { User, Chat } from "@/types";
import Avatar from "./Avatar";
import { X, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInfoProps {
  chat: Chat | null;
  activeChatUser: User | null;
  onClose: () => void;
}

const ChatInfo: React.FC<ChatInfoProps> = ({ chat, activeChatUser, onClose }) => {
  const isGroup = chat?.isGroup;
  const user = isGroup ? null : activeChatUser;
  
  return (
    <div className="h-full flex flex-col bg-white border-l">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b">
        <h3 className="font-semibold">Contact Info</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* User/Group Info */}
      <div className="p-6 flex flex-col items-center border-b">
        <Avatar 
          user={isGroup 
            ? { id: chat?.id || "", name: chat?.groupName || "", avatar: chat?.groupAvatar || "" } 
            : user} 
          size="lg" 
        />
        <h3 className="font-semibold mt-4">
          {isGroup ? chat?.groupName : user?.name}
        </h3>
        <p className="text-sm text-gray-500">
          {isGroup 
            ? `Group · ${chat?.participants.length} participants` 
            : user?.phoneNumber}
        </p>
      </div>
      
      {/* About/Description */}
      {!isGroup && user?.status && (
        <div className="p-4 border-b">
          <h4 className="text-sm text-gray-500 mb-1">About</h4>
          <p>{user.status}</p>
        </div>
      )}
      
      {/* Media, Links, Docs */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium">Media, Links and Docs</span>
          <Button variant="link" className="text-xs text-whatsapp-teal p-0 h-auto">
            {`${Math.floor(Math.random() * 20) + 5} >`}
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-1">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex-1">
        <div className="p-4 flex items-center text-whatsapp-teal">
          <Bell className="h-5 w-5 mr-3" />
          <span>Mute notifications</span>
        </div>
        
        <div className="p-4 flex items-center text-whatsapp-teal">
          <Search className="h-5 w-5 mr-3" />
          <span>Search in conversation</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInfo;
