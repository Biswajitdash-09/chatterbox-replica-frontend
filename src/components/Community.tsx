
import { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { Community as CommunityType } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, ChevronRight } from "lucide-react";
import Avatar from "./Avatar";

interface CommunityProps {
  isOpen: boolean;
  onClose: () => void;
}

const Community: React.FC<CommunityProps> = ({ isOpen, onClose }) => {
  const { communities, setActiveCommunity, setActiveChat } = useChat();
  
  const handleSelectCommunity = (community: CommunityType) => {
    setActiveCommunity(community);
    onClose();
  };
  
  const handleSelectGroup = (communityId: string, groupId: string) => {
    const community = communities.find(c => c.id === communityId);
    const group = community?.groups.find(g => g.id === groupId);
    
    if (community && group) {
      setActiveCommunity(community);
      setActiveChat(group);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Communities</DialogTitle>
        </DialogHeader>
        
        <div className="py-2">
          {communities.length > 0 ? (
            <div className="space-y-4">
              {communities.map(community => (
                <div key={community.id} className="border rounded-lg overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSelectCommunity(community)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-whatsapp-teal rounded-lg p-2">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">{community.name}</h3>
                        <p className="text-xs text-gray-500">
                          {community.groups.length} groups
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                  
                  <div className="bg-gray-50 p-2">
                    <h4 className="text-xs text-gray-500 px-2 mb-1">GROUPS</h4>
                    <div className="space-y-1">
                      {community.groups.map(group => (
                        <div 
                          key={group.id}
                          className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSelectGroup(community.id, group.id)}
                        >
                          <div className="flex items-center gap-2">
                            <Avatar 
                              user={{ 
                                id: group.id, 
                                name: group.groupName || "", 
                                avatar: group.groupAvatar || "" 
                              }} 
                              size="sm" 
                            />
                            <span className="text-sm">{group.groupName}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No communities found
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Community;
