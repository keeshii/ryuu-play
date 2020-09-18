
export interface MessageInfo {
  messageId: number;
  senderId: number;
  created: number;
  text: string;
  isRead: boolean;
}

export interface ConversationInfo {
  user1Id: number;
  user2Id: number;
  lastMessage: MessageInfo
}
