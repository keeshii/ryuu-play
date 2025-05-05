import { Response } from './response.interface';
import { AvatarInfo } from '@ptcg/common';

export interface AvatarResponse extends Response {
  avatar: AvatarInfo;
}

export interface AvatarListResponse extends Response {
  avatars: AvatarInfo[];
}
