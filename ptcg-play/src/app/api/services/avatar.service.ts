import { Injectable } from '@angular/core';

import { ApiService } from '../api.service';
import { AvatarListResponse, AvatarResponse } from '../interfaces/avatar.interface';
import { Response } from '../interfaces/response.interface';


@Injectable()
export class AvatarService {

  constructor(
    private api: ApiService,
  ) {}

  public getList() {
    return this.api.get<AvatarListResponse>('/avatars/list');
  }

  public addAvatar(avatarName: string, imageBase64: string) {
    return this.api.post<AvatarResponse>('/avatars/add', {
      name: avatarName,
      imageBase64
    });
  }

  public deleteAvatar(avatarId: number) {
    return this.api.post<Response>('/avatars/delete', {
      id: avatarId
    });
  }

  public rename(avatarId: number, name: string) {
    return this.api.post<AvatarResponse>('/avatars/rename', {
      id: avatarId,
      name
    });
  }

  public markAsDefault(avatarId: number) {
    return this.api.post<Response>('/avatars/markAsDefault', {
      id: avatarId
    });
  }

}
