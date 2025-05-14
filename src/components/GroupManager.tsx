
import { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { User } from "@/types";
import { contacts, currentUser } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Users, UserPlus } from "lucide-react";
import Avatar from "./Avatar";
import { Input } from "@/components/ui/input";

interface GroupManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const GroupManager: React.FC<GroupManagerProps> = ({ isOpen, onClose }) => {
  const { activeChat, addMemberToGroup, exitGroup } = useChat();
  const [searchQuery, setSearchQuery] = useState("");
  
  if (!activeChat || !activeChat.isGroup) {
    return null;
  }
  
  const handleExitGroup = () => {
    exitGroup(activeChat.id);
    onClose();
  };
  
  const handleAddMember = (userId: string) => {
    addMemberToGroup(activeChat.id, userId);
  };
  
  // Filter out users who are already in the group
  const availableContacts = contacts.filter(
    contact => !activeChat.participants.some(p => p.id === contact.id)
      && contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Group Management</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div>
            <h3 className="text-sm font-medium mb-2">Current Members ({activeChat.participants.length})</h3>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {activeChat.participants.map(user => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar user={user} size="sm" />
                    <span className="text-sm">
                      {user.name} {user.id === currentUser.id && "(You)"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Add Members</h3>
            <Input 
              placeholder="Search contacts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-2"
            />
            <div className="max-h-40 overflow-y-auto space-y-2">
              {availableContacts.length > 0 ? (
                availableContacts.map(user => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar user={user} size="sm" />
                      <span className="text-sm">{user.name}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleAddMember(user.id)}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-gray-500 py-2">
                  No contacts found
                </p>
              )}
            </div>
          </div>
          
          <div className="pt-4 flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleExitGroup}>
              <X className="mr-2 h-4 w-4" />
              Exit Group
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupManager;
