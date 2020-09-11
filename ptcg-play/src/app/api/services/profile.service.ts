import { Injectable } from '@angular/core';

import { ApiService } from '../api.service';
import { ProfileResponse, MatchHistoryResponse } from '../interfaces/profile.interface';

@Injectable()
export class ProfileService {

  constructor(
    private api: ApiService,
  ) {}

  public getMe() {
    return this.api.get<ProfileResponse>('/v1/profile/me');
  }

  public getUser(userId: number) {
    return this.api.get<ProfileResponse>('/v1/profile/get/' + userId);
  }

  public getMatchHistory(userId: number) {
    return this.api.get<MatchHistoryResponse>('/v1/profile/matchHistory/' + userId);
  }

}
