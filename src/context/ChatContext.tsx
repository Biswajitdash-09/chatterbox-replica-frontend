
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Chat, Message } from "@/types";
import { chats as initialChats, currentUser, findUserById, findChatById } from "@/data/mockData";

interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  setActiveChat: (chat: Chat | null) => void;
  sendMessage: (text: string) => void;
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
    }, 1000);
  };

  return (
    <ChatContext.Provider value={{
      chats,
      activeChat,
      setActiveChat,
      sendMessage
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
