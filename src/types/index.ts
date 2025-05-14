
export interface User {
  id: string;
  name: string;
  avatar: string;
  status?: string;
  lastSeen?: string;
  isOnline?: boolean;
  phoneNumber?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  isDeleted?: boolean;
  media?: {
    type: 'image' | 'video' | 'audio' | 'document';
    url: string;
    name?: string;
    size?: string;
  }[];
  reactions?: {
    userId: string;
    emoji: string;
  }[];
}

export interface Chat {
  id: string;
  participants: User[];
  messages: Message[];
  unreadCount: number;
  lastMessageTimestamp: string;
  isGroup?: boolean;
  groupName?: string;
  groupAvatar?: string;
  typingUsers?: string[]; // Array of user IDs currently typing
}
