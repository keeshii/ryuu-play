import { Injectable } from '@angular/core';

import { ApiService } from '../api.service';
import { ProfileResponse } from '../interfaces/profile.interface';

@Injectable()
export class ProfileService {

  constructor(
    private api: ApiService,
  ) {}

  public getMe() {
    return this.api.get<ProfileResponse>('/profile/me');
  }

}
