import { UserInfo } from "./core.interface";

export interface MessageInfo {
  senderId: number;
  created: number;
  text: string;
  isRead: boolean;
}

export interface ConversationInfo {
  user1: UserInfo;
  user2: UserInfo;
  lastMessage: MessageInfo
}
