import {Rang} from "../../storage";

export interface UserInfo {
  clientIds: number[];
  userId: number;
  name: string;
  email: string;
  ranking: number;
  rang: Rang;
  avatarFile: string;
}
