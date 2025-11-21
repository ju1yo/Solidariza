

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  message: string;
  read: boolean;
  createdAt: Date;
  senderName?: string;
  senderPhoto?: string | null;
}

export interface Conversation {
  id: string;
  user1Id: string;
  user2Id: string;
  lastMessage?: string | null;
  updatedAt: Date;
  otherUser?: {
    id: string;
    name: string;
    foto_perfil?: string | null;
  };
}

export interface SendMessageDTO {
  receiverId: string;
  message: string;
  conversationId: string;
}


export interface ServerToClientEvents {
  receive_message: (message: Message) => void;
  message_sent: (message: Message) => void;
  user_typing: (data: { userId: string; userName: string }) => void;
  user_stop_typing: (data: { userId: string }) => void;
  user_online: (data: { userId: string; userName: string }) => void;
  user_offline: (data: { userId: string }) => void;
  message_error: (data: { error: string }) => void;
}

export interface ClientToServerEvents {
  join_conversation: (conversationId: string) => void;
  send_message: (data: SendMessageDTO) => void;
  typing: (data: { receiverId: string }) => void;
  stop_typing: (data: { receiverId: string }) => void;
  mark_as_read: (data: { messageId: string }) => void;
}

export interface SocketData {
  userId: string;
  userName: string;
}