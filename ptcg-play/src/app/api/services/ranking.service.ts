import { Injectable } from '@angular/core';

import { ApiService } from '../api.service';
import { RankingResponse } from '../interfaces/ranking.interface';


@Injectable()
export class RankingService {

  constructor(
    private api: ApiService,
  ) {}

  public getList(page: number = 0) {
    return this.api.get<RankingResponse>('/ranking/list/' + page);
  }

}
