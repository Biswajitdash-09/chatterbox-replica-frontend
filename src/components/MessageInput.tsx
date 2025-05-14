
import { useState, useEffect } from "react";
import { Smile, Paperclip, Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useChat } from "@/context/ChatContext";
import debounce from "lodash.debounce";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState<string>("");
  const { startTyping, stopTyping } = useChat();
  
  const debouncedStopTyping = debounce(() => {
    stopTyping();
  }, 1000);
  
  useEffect(() => {
    return () => {
      debouncedStopTyping.cancel();
      stopTyping();
    };
  }, [debouncedStopTyping, stopTyping]);
  
  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      stopTyping();
      debouncedStopTyping.cancel();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    
    if (value.trim()) {
      startTyping();
      debouncedStopTyping();
    } else {
      debouncedStopTyping.cancel();
      stopTyping();
    }
  };

  return (
    <div className="px-4 py-3 bg-white">
      <div className="flex items-end gap-2">
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="text-gray-600 rounded-full">
            <Smile className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600 rounded-full">
            <Paperclip className="h-5 w-5" />
          </Button>
        </div>
        
        <div className={cn("flex-1 relative")}>
          <Textarea
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className="resize-none min-h-[40px] max-h-[120px] py-2 px-3 rounded-lg"
            rows={1}
          />
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-600 rounded-full"
          onClick={handleSend}
        >
          {message.trim() ? (
            <Send className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
