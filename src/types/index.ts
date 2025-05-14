
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

export interface Call {
  id: string;
  participants: User[];
  timestamp: string;
  duration?: string; // in seconds
  type: 'audio' | 'video';
  status: 'missed' | 'incoming' | 'outgoing';
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
  isArchived?: boolean;
  isFavorite?: boolean;
  calls?: Call[];
}

export interface Community {
  id: string;
  name: string;
  avatar: string;
  description?: string;
  createdBy: string; // User ID
  admins: string[]; // Array of user IDs
  groups: Chat[]; // Array of group chats
  announcements?: Message[];
  createdAt: string;
}
