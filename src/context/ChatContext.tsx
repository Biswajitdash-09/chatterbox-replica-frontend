import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Chat, Message, Call, Community } from "@/types";
import { chats as initialChats, currentUser, findUserById, findChatById } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";

interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  communities: Community[];
  activeCommunity: Community | null;
  recentCalls: Call[];
  setActiveChat: (chat: Chat | null) => void;
  setActiveCommunity: (community: Community | null) => void;
  sendMessage: (text: string) => void;
  startTyping: () => void;
  stopTyping: () => void;
  addReaction: (messageId: string, emoji: string) => void;
  deleteMessage: (messageId: string) => void;
  toggleArchive: (chatId: string) => void;
  toggleFavorite: (chatId: string) => void;
  addMemberToGroup: (chatId: string, userId: string) => void;
  exitGroup: (chatId: string) => void;
  uploadMedia: (files: File[], text?: string) => void;
  makeCall: (chatId: string, type: 'audio' | 'video') => void;
}

// Import the mock communities
import { communities as initialCommunities } from "@/data/mockData";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [communities, setCommunities] = useState<Community[]>(initialCommunities || []);
  const [activeCommunity, setActiveCommunity] = useState<Community | null>(null);
  const [recentCalls, setRecentCalls] = useState<Call[]>([]);
  
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

  const toggleArchive = (chatId: string) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? { ...chat, isArchived: !chat.isArchived }
          : chat
      )
    );

    // Update active chat if it's the one being archived
    if (activeChat?.id === chatId) {
      setActiveChat(prevChat =>
        prevChat ? { ...prevChat, isArchived: !prevChat.isArchived } : null
      );
    }

    const chat = chats.find(c => c.id === chatId);
    const action = chat?.isArchived ? "unarchived" : "archived";
    
    toast({
      title: `Chat ${action}`,
      description: `The chat has been ${action} successfully.`,
      duration: 2000,
    });
  };

  const toggleFavorite = (chatId: string) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? { ...chat, isFavorite: !chat.isFavorite }
          : chat
      )
    );

    // Update active chat if it's the one being favorited
    if (activeChat?.id === chatId) {
      setActiveChat(prevChat =>
        prevChat ? { ...prevChat, isFavorite: !prevChat.isFavorite } : null
      );
    }

    const chat = chats.find(c => c.id === chatId);
    const action = chat?.isFavorite ? "removed from favorites" : "added to favorites";
    
    toast({
      title: "Favorites updated",
      description: `The chat has been ${action}.`,
      duration: 2000,
    });
  };

  const addMemberToGroup = (chatId: string, userId: string) => {
    const userToAdd = findUserById(userId);
    if (!userToAdd) return;

    setChats(prevChats =>
      prevChats.map(chat => {
        if (chat.id === chatId && chat.isGroup) {
          // Check if user is already in the group
          if (chat.participants.some(p => p.id === userId)) {
            toast({
              title: "User already in group",
              description: `${userToAdd.name} is already a member of this group.`,
              duration: 2000,
            });
            return chat;
          }

          // Add user to the group
          const updatedChat = {
            ...chat,
            participants: [...chat.participants, userToAdd]
          };

          toast({
            title: "Member added",
            description: `${userToAdd.name} has been added to the group.`,
            duration: 2000,
          });

          return updatedChat;
        }
        return chat;
      })
    );

    // Update active chat if it's the one being modified
    if (activeChat?.id === chatId) {
      setActiveChat(prevChat => {
        if (prevChat && prevChat.isGroup) {
          // Check if user is already in the group
          if (prevChat.participants.some(p => p.id === userId)) return prevChat;
          
          return {
            ...prevChat,
            participants: [...prevChat.participants, userToAdd]
          };
        }
        return prevChat;
      });
    }
  };

  const exitGroup = (chatId: string) => {
    setChats(prevChats =>
      prevChats.map(chat => {
        if (chat.id === chatId && chat.isGroup) {
          return {
            ...chat,
            participants: chat.participants.filter(p => p.id !== currentUser.id)
          };
        }
        return chat;
      })
    );

    // If the active chat is the one being exited, clear it
    if (activeChat?.id === chatId) {
      setActiveChat(null);
    }

    toast({
      title: "Group exited",
      description: "You have left the group successfully.",
      duration: 2000,
    });
  };

  const uploadMedia = (files: File[], text?: string) => {
    if (!activeChat) return;
    
    // Create URLs for the files (in a real app, these would be uploaded to a server)
    const media = Array.from(files).map(file => {
      const fileType = file.type.startsWith('image/') 
        ? 'image' as const
        : file.type.startsWith('video/') 
          ? 'video' as const
          : file.type.startsWith('audio/') 
            ? 'audio' as const
            : 'document' as const;
      
      return {
        type: fileType,
        url: URL.createObjectURL(file),
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`
      };
    });
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text: text || "",
      timestamp: new Date().toISOString(),
      status: "sent",
      media
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
    
    // Simulate message delivery
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
        title: "Media sent",
        description: "Your media files have been sent successfully.",
        duration: 2000,
      });
    }, 1000);
  };

  const makeCall = (chatId: string, type: 'audio' | 'video') => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    // Create a new call object
    const newCall: Call = {
      id: `call-${Date.now()}`,
      participants: chat.participants,
      timestamp: new Date().toISOString(),
      duration: "0", // Initial duration
      type,
      status: "outgoing"
    };

    // Add the call to recent calls
    setRecentCalls(prev => [newCall, ...prev]);

    // Add the call to the chat's call history if it exists
    setChats(prevChats =>
      prevChats.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            calls: c.calls ? [...c.calls, newCall] : [newCall]
          };
        }
        return c;
      })
    );

    // Update active chat if it's the current chat
    if (activeChat?.id === chatId) {
      setActiveChat(prevChat => {
        if (!prevChat) return null;
        
        return {
          ...prevChat,
          calls: prevChat.calls ? [...prevChat.calls, newCall] : [newCall]
        };
      });
    }

    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} call started`,
      description: `Calling ${chat.isGroup ? chat.groupName : chat.participants.find(p => p.id !== currentUser.id)?.name}...`,
      duration: 2000,
    });

    // In a real app, this would initiate an actual call
    // For this example, we'll just simulate a short call
    setTimeout(() => {
      // Update the call duration
      const updatedCall = { ...newCall, duration: "15" }; // 15 seconds
      
      setRecentCalls(prev => 
        prev.map(call => 
          call.id === newCall.id ? updatedCall : call
        )
      );
      
      setChats(prevChats =>
        prevChats.map(c => {
          if (c.id === chatId && c.calls) {
            return {
              ...c,
              calls: c.calls.map(call => 
                call.id === newCall.id ? updatedCall : call
              )
            };
          }
          return c;
        })
      );
      
      if (activeChat?.id === chatId) {
        setActiveChat(prevChat => {
          if (!prevChat || !prevChat.calls) return prevChat;
          
          return {
            ...prevChat,
            calls: prevChat.calls.map(call => 
              call.id === newCall.id ? updatedCall : call
            )
          };
        });
      }
      
      toast({
        title: "Call ended",
        description: `Call duration: 15 seconds`,
        duration: 2000,
      });
    }, 3000);
  };

  return (
    <ChatContext.Provider value={{
      chats,
      activeChat,
      communities,
      activeCommunity,
      recentCalls,
      setActiveChat,
      setActiveCommunity,
      sendMessage,
      startTyping,
      stopTyping,
      addReaction,
      deleteMessage,
      toggleArchive,
      toggleFavorite,
      addMemberToGroup,
      exitGroup,
      uploadMedia,
      makeCall
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
