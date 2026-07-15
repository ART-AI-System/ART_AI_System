export interface ChatUser {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  avatar?: string;
  username?: string;
  studentCode?: string;
}

export interface ChatMessage {
  _id: string;
  roomId: string;
  senderId: string;
  content: string;
  messageType: 'text' | 'image' | 'file';
  fileMetadata?: any;
  isDeleted: boolean;
  readBy: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatRoom {
  _id: string;
  type: 'direct' | 'group';
  memberIds: string[];
  lastMessage?: string;
  lastMessageAt?: string;
  archivedBy: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
