
import { User, Message, Chat } from "../types";

export const currentUser: User = {
  id: "user-1",
  name: "John Doe",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  status: "Available",
  phoneNumber: "+1 234 567 890"
};

export const contacts: User[] = [
  {
    id: "user-2",
    name: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    status: "At work",
    lastSeen: "Today at 10:30 AM",
    isOnline: true,
    phoneNumber: "+1 234 567 891"
  },
  {
    id: "user-3",
    name: "Mike Taylor",
    avatar: "https://randomuser.me/api/portraits/men/86.jpg",
    status: "At the gym",
    lastSeen: "Today at 9:15 AM",
    isOnline: false,
    phoneNumber: "+1 234 567 892"
  },
  {
    id: "user-4",
    name: "Emily Wilson",
    avatar: "https://randomuser.me/api/portraits/women/17.jpg",
    status: "Busy",
    lastSeen: "Yesterday at 7:22 PM",
    isOnline: false,
    phoneNumber: "+1 234 567 893"
  },
  {
    id: "user-5",
    name: "David Brown",
    avatar: "https://randomuser.me/api/portraits/men/61.jpg",
    status: "Hey there! I'm using WhatsApp",
    lastSeen: "Today at 11:45 AM",
    isOnline: true,
    phoneNumber: "+1 234 567 894"
  },
  {
    id: "group-1",
    name: "Family Group",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    status: "Family matters",
    isOnline: false,
    phoneNumber: ""
  },
  {
    id: "user-6",
    name: "Jessica Lee",
    avatar: "https://randomuser.me/api/portraits/women/90.jpg",
    status: "On vacation until June 15",
    lastSeen: "Yesterday at 5:30 PM",
    isOnline: false,
    phoneNumber: "+1 234 567 895"
  },
  {
    id: "user-7",
    name: "Daniel White",
    avatar: "https://randomuser.me/api/portraits/men/29.jpg",
    status: "Can't talk right now",
    lastSeen: "Today at 8:05 AM",
    isOnline: true,
    phoneNumber: "+1 234 567 896"
  },
  {
    id: "group-2",
    name: "Work Team",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    status: "Project updates and discussion",
    isOnline: false,
    phoneNumber: ""
  },
];

const generateMessageHistory = (user1Id: string, user2Id: string): Message[] => {
  const now = new Date();
  const messages: Message[] = [];
  
  // Yesterday messages
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  
  messages.push({
    id: `msg-${user1Id}-${user2Id}-1`,
    senderId: user1Id,
    text: "Hey, how are you?",
    timestamp: yesterday.toISOString(),
    status: "read"
  });
  
  messages.push({
    id: `msg-${user2Id}-${user1Id}-1`,
    senderId: user2Id,
    text: "I'm doing well, thanks for asking! How about you?",
    timestamp: yesterday.toISOString(),
    status: "read"
  });
  
  messages.push({
    id: `msg-${user1Id}-${user2Id}-2`,
    senderId: user1Id,
    text: "I'm good too. Just working on some projects.",
    timestamp: yesterday.toISOString(),
    status: "read"
  });
  
  // Today messages
  const hourAgo = new Date(now);
  hourAgo.setHours(now.getHours() - 1);
  
  messages.push({
    id: `msg-${user2Id}-${user1Id}-2`,
    senderId: user2Id,
    text: "That sounds interesting! What kind of projects are you working on?",
    timestamp: hourAgo.toISOString(),
    status: "read"
  });
  
  messages.push({
    id: `msg-${user1Id}-${user2Id}-3`,
    senderId: user1Id,
    text: "I'm building a WhatsApp clone with React. It's coming along nicely!",
    timestamp: hourAgo.toISOString(),
    status: "read"
  });
  
  const thirtyMinAgo = new Date(now);
  thirtyMinAgo.setMinutes(now.getMinutes() - 30);
  
  messages.push({
    id: `msg-${user2Id}-${user1Id}-3`,
    senderId: user2Id,
    text: "That's awesome! I'd love to see it when you're done.",
    timestamp: thirtyMinAgo.toISOString(),
    status: "read"
  });
  
  messages.push({
    id: `msg-${user1Id}-${user2Id}-4`,
    senderId: user1Id,
    text: "Sure thing! I'll send you a link once it's ready.",
    timestamp: now.toISOString(),
    status: "delivered"
  });
  
  return messages;
};

export const generateChats = (): Chat[] => {
  return contacts.map(contact => {
    const isGroup = contact.id.startsWith("group");
    const messages = isGroup 
      ? generateGroupMessages(contact.id)
      : generateMessageHistory(currentUser.id, contact.id);
    
    const lastMessage = messages[messages.length - 1];
    
    return {
      id: `chat-${contact.id}`,
      participants: isGroup 
        ? [currentUser, contact, ...contacts.slice(0, 3).filter(c => c.id !== contact.id)] 
        : [currentUser, contact],
      messages: messages,
      unreadCount: Math.floor(Math.random() * 3),
      lastMessageTimestamp: lastMessage.timestamp,
      isGroup: isGroup,
      groupName: isGroup ? contact.name : undefined,
      groupAvatar: isGroup ? contact.avatar : undefined
    };
  });
};

const generateGroupMessages = (groupId: string): Message[] => {
  const now = new Date();
  const messages: Message[] = [];
  
  // Generate 5 messages for each group with different senders
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  
  messages.push({
    id: `msg-group-${groupId}-1`,
    senderId: contacts[0].id,
    text: "Hey everyone! How's it going?",
    timestamp: yesterday.toISOString(),
    status: "read"
  });
  
  messages.push({
    id: `msg-group-${groupId}-2`,
    senderId: contacts[1].id,
    text: "I'm good, thanks for asking!",
    timestamp: yesterday.toISOString(),
    status: "read"
  });
  
  const hourAgo = new Date(now);
  hourAgo.setHours(now.getHours() - 1);
  
  messages.push({
    id: `msg-group-${groupId}-3`,
    senderId: currentUser.id,
    text: "What's everyone up to today?",
    timestamp: hourAgo.toISOString(),
    status: "read"
  });
  
  messages.push({
    id: `msg-group-${groupId}-4`,
    senderId: contacts[2].id,
    text: "Just working on some projects. How about you?",
    timestamp: hourAgo.toISOString(),
    status: "read"
  });
  
  messages.push({
    id: `msg-group-${groupId}-5`,
    senderId: currentUser.id,
    text: "I'm building a WhatsApp clone with React!",
    timestamp: now.toISOString(),
    status: "delivered"
  });
  
  return messages;
};

export const chats = generateChats();

// Helper functions for finding data
export const findUserById = (id: string): User | undefined => {
  if (id === currentUser.id) return currentUser;
  return contacts.find(contact => contact.id === id);
};

export const findChatById = (id: string): Chat | undefined => {
  return chats.find(chat => chat.id === id);
};

export const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString([], { weekday: 'long' });
  }
};
