import { Rank } from "./rank.enum";

export interface UserInfo {
  clientIds: number[];
  userId: number;
  name: string;
  email: string;
  ranking: number;
  rank: Rank;
  avatarFile: string;
}
