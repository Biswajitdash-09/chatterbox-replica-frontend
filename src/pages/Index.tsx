
import { useState } from "react";
import { ChatProvider, useChat } from "@/context/ChatContext";
import Sidebar from "@/components/Sidebar";
import ChatHeader from "@/components/ChatHeader";
import ChatMessages from "@/components/ChatMessages";
import MessageInput from "@/components/MessageInput";
import ChatInfo from "@/components/ChatInfo";
import { currentUser, findUserById } from "@/data/mockData";

const ChatLayout = () => {
  const { chats, activeChat, setActiveChat, sendMessage } = useChat();
  const [showChatInfo, setShowChatInfo] = useState(false);
  
  // Find the other user in the chat (for 1-on-1 chats)
  const activeChatUser = activeChat && !activeChat.isGroup 
    ? activeChat.participants.find(p => p.id !== currentUser.id) || null
    : null;
  
  const handleChatSelect = (chat: Chat) => {
    setActiveChat(chat);
    setShowChatInfo(false);
  };
  
  const toggleChatInfo = () => {
    setShowChatInfo(!showChatInfo);
  };

  return (
    <div className="flex h-full">
      <div className="w-[350px] h-full">
        <Sidebar 
          chats={chats}
          activeChat={activeChat}
          onChatSelect={handleChatSelect}
        />
      </div>
      
      {activeChat ? (
        <>
          <div className="flex-1 flex flex-col h-full">
            <ChatHeader 
              activeChat={activeChat}
              activeChatUser={activeChatUser}
              onInfoToggle={toggleChatInfo}
            />
            
            <ChatMessages 
              messages={activeChat.messages}
              isGroup={!!activeChat.isGroup}
            />
            
            <MessageInput onSendMessage={sendMessage} />
          </div>
          
          {showChatInfo && (
            <div className="w-[320px] h-full">
              <ChatInfo 
                chat={activeChat}
                activeChatUser={activeChatUser}
                onClose={() => setShowChatInfo(false)}
              />
            </div>
          )}
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-[#f0f2f5]">
          <div className="text-center max-w-md px-4">
            <h2 className="text-2xl font-light text-gray-600 mb-3">
              WhatsApp Web
            </h2>
            <p className="text-gray-500">
              Send and receive messages without keeping your phone online.
              Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const Index = () => {
  return (
    <div className="h-screen flex flex-col">
      <ChatProvider>
        <ChatLayout />
      </ChatProvider>
    </div>
  );
};

export default Index;
