
import { useChat } from "@/context/ChatContext";
import { Call } from "@/types";
import { findUserById, formatTime, formatDate, formatDuration } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Phone, Video, PhoneOff, PhoneIncoming, PhoneOutgoing, X } from "lucide-react";
import Avatar from "./Avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RecentCallsProps {
  isOpen: boolean;
  onClose: () => void;
}

const RecentCalls: React.FC<RecentCallsProps> = ({ isOpen, onClose }) => {
  const { recentCalls, activeChat, makeCall } = useChat();
  
  const getCallIcon = (call: Call) => {
    switch (call.status) {
      case "missed":
        return <PhoneOff className="h-4 w-4 text-red-500" />;
      case "incoming":
        return <PhoneIncoming className="h-4 w-4 text-green-500" />;
      case "outgoing":
        return <PhoneOutgoing className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };
  
  const getCallTitle = (call: Call) => {
    if (call.participants.length > 2) {
      return "Group Call";
    }
    
    const otherUser = call.participants.find(p => p.id !== findUserById("user-1")?.id);
    return otherUser?.name || "Unknown User";
  };

  const handleMakeCall = (type: 'audio' | 'video') => {
    if (activeChat) {
      makeCall(activeChat.id, type);
      onClose();
    }
  };

  const groupCallsByDate = () => {
    const grouped: Record<string, Call[]> = {};
    
    recentCalls.forEach(call => {
      const date = formatDate(call.timestamp);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(call);
    });
    
    return grouped;
  };

  const groupedCalls = groupCallsByDate();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Recent Calls</DialogTitle>
        </DialogHeader>
        
        <div className="py-2">
          {Object.keys(groupedCalls).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(groupedCalls).map(([date, calls]) => (
                <div key={date}>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{date}</h3>
                  <div className="space-y-2">
                    {calls.map(call => (
                      <div key={call.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100">
                        <div className="flex items-center gap-3">
                          <Avatar 
                            user={call.participants.find(p => p.id !== findUserById("user-1")?.id)} 
                            showStatus={false}
                          />
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{getCallTitle(call)}</span>
                              {getCallIcon(call)}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <span>{call.type === 'audio' ? 'Audio' : 'Video'} call</span>
                              <span>•</span>
                              <span>{formatTime(call.timestamp)}</span>
                              <span>•</span>
                              <span>{formatDuration(call.duration || "0")}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {call.type === 'audio' ? (
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 rounded-full"
                              onClick={() => handleMakeCall('audio')}
                            >
                              <Phone className="h-4 w-4 text-green-500" />
                            </Button>
                          ) : (
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 rounded-full"
                              onClick={() => handleMakeCall('video')}
                            >
                              <Video className="h-4 w-4 text-blue-500" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No recent calls
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecentCalls;
