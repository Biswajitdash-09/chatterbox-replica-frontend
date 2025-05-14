
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Smile } from "lucide-react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const commonEmojis = ["👍", "❤️", "😂", "🙏", "😢", "😮", "🎉"];

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  const [open, setOpen] = useState(false);
  
  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setOpen(false);
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100"
        >
          <Smile className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="end" side="top">
        <div className="flex gap-2">
          {commonEmojis.map(emoji => (
            <Button 
              key={emoji}
              variant="ghost" 
              className="h-8 w-8 p-0"
              onClick={() => handleEmojiClick(emoji)}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
