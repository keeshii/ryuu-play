import { Injectable } from '@angular/core';

import { ApiService } from '../api.service';
import { ProfileResponse, MatchHistoryResponse } from '../interfaces/profile.interface';

@Injectable()
export class ProfileService {

  constructor(
    private api: ApiService,
  ) {}

  public getMe() {
    return this.api.get<ProfileResponse>('/profile/me');
  }

  public getUser(userId: number) {
    return this.api.get<ProfileResponse>('/profile/get/' + userId);
  }

  public getMatchHistory(userId: number) {
    return this.api.get<MatchHistoryResponse>('/profile/matchHistory/' + userId);
  }

}
