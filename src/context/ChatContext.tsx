
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Chat, Message } from "@/types";
import { chats as initialChats, currentUser, findUserById, findChatById } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";

interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  setActiveChat: (chat: Chat | null) => void;
  sendMessage: (text: string) => void;
  startTyping: () => void;
  stopTyping: () => void;
  addReaction: (messageId: string, emoji: string) => void;
  deleteMessage: (messageId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  
  const sendMessage = (text: string) => {
    if (!activeChat) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text,
      timestamp: new Date().toISOString(),
      status: "sent"
    };
    
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === activeChat.id
          ? { 
              ...chat, 
              messages: [...chat.messages, newMessage],
              lastMessageTimestamp: newMessage.timestamp,
              typingUsers: chat.typingUsers?.filter(id => id !== currentUser.id) || []
            }
          : chat
      )
    );
    
    // Update active chat with the new message
    setActiveChat(prevChat => 
      prevChat ? { 
        ...prevChat, 
        messages: [...prevChat.messages, newMessage],
        lastMessageTimestamp: newMessage.timestamp,
        typingUsers: prevChat.typingUsers?.filter(id => id !== currentUser.id) || []
      } : null
    );
    
    // Simulate message delivery after a short delay
    setTimeout(() => {
      setChats(prevChats => 
        prevChats.map(chat => {
          if (chat.id !== activeChat.id) return chat;
          
          return {
            ...chat,
            messages: chat.messages.map(msg => 
              msg.id === newMessage.id
                ? { ...msg, status: "delivered" }
                : msg
            )
          };
        })
      );
      
      setActiveChat(prevChat => 
        prevChat ? {
          ...prevChat,
          messages: prevChat.messages.map(msg => 
            msg.id === newMessage.id
              ? { ...msg, status: "delivered" }
              : msg
          )
        } : null
      );

      toast({
        title: "Message delivered",
        description: "Your message has been delivered successfully.",
        duration: 2000,
      });
    }, 1000);
  };

  const startTyping = () => {
    if (!activeChat) return;
    
    // Add current user to typing users if not already there
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id !== activeChat.id) return chat;
        
        const typingUsers = chat.typingUsers || [];
        if (typingUsers.includes(currentUser.id)) return chat;
        
        return {
          ...chat,
          typingUsers: [...typingUsers, currentUser.id]
        };
      })
    );
    
    setActiveChat(prevChat => {
      if (!prevChat) return null;
      
      const typingUsers = prevChat.typingUsers || [];
      if (typingUsers.includes(currentUser.id)) return prevChat;
      
      return {
        ...prevChat,
        typingUsers: [...typingUsers, currentUser.id]
      };
    });
  };
  
  const stopTyping = () => {
    if (!activeChat) return;
    
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id !== activeChat.id) return chat;
        
        return {
          ...chat,
          typingUsers: (chat.typingUsers || []).filter(id => id !== currentUser.id)
        };
      })
    );
    
    setActiveChat(prevChat => {
      if (!prevChat) return null;
      
      return {
        ...prevChat,
        typingUsers: (prevChat.typingUsers || []).filter(id => id !== currentUser.id)
      };
    });
  };
  
  const addReaction = (messageId: string, emoji: string) => {
    if (!activeChat) return;
    
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id !== activeChat.id) return chat;
        
        return {
          ...chat,
          messages: chat.messages.map(msg => {
            if (msg.id !== messageId) return msg;
            
            const reactions = msg.reactions || [];
            const existingReaction = reactions.find(r => r.userId === currentUser.id);
            
            if (existingReaction) {
              // Update existing reaction
              return {
                ...msg,
                reactions: reactions.map(r => 
                  r.userId === currentUser.id ? { userId: currentUser.id, emoji } : r
                )
              };
            } else {
              // Add new reaction
              return {
                ...msg,
                reactions: [...reactions, { userId: currentUser.id, emoji }]
              };
            }
          })
        };
      })
    );
    
    setActiveChat(prevChat => {
      if (!prevChat) return null;
      
      return {
        ...prevChat,
        messages: prevChat.messages.map(msg => {
          if (msg.id !== messageId) return msg;
          
          const reactions = msg.reactions || [];
          const existingReaction = reactions.find(r => r.userId === currentUser.id);
          
          if (existingReaction) {
            // Update existing reaction
            return {
              ...msg,
              reactions: reactions.map(r => 
                r.userId === currentUser.id ? { userId: currentUser.id, emoji } : r
              )
            };
          } else {
            // Add new reaction
            return {
              ...msg,
              reactions: [...reactions, { userId: currentUser.id, emoji }]
            };
          }
        })
      };
    });

    toast({
      title: "Reaction added",
      description: `You reacted with ${emoji}`,
      duration: 2000,
    });
  };
  
  const deleteMessage = (messageId: string) => {
    if (!activeChat) return;
    
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id !== activeChat.id) return chat;
        
        return {
          ...chat,
          messages: chat.messages.map(msg => 
            msg.id === messageId
              ? { ...msg, isDeleted: true, text: "This message was deleted" }
              : msg
          )
        };
      })
    );
    
    setActiveChat(prevChat => {
      if (!prevChat) return null;
      
      return {
        ...prevChat,
        messages: prevChat.messages.map(msg => 
          msg.id === messageId
            ? { ...msg, isDeleted: true, text: "This message was deleted" }
            : msg
        )
      };
    });

    toast({
      title: "Message deleted",
      description: "Your message has been deleted.",
      duration: 2000,
    });
  };

  return (
    <ChatContext.Provider value={{
      chats,
      activeChat,
      setActiveChat,
      sendMessage,
      startTyping,
      stopTyping,
      addReaction,
      deleteMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
