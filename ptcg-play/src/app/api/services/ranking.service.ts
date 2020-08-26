import { Injectable } from '@angular/core';

import { ApiService } from '../api.service';
import { RankingResponse } from '../interfaces/ranking.interface';


@Injectable()
export class RankingService {

  constructor(
    private api: ApiService,
  ) {}

  public getList(page: number = 0, query: string = '') {
    return query === ''
      ? this.api.get<RankingResponse>('/ranking/list/' + page)
      : this.api.post<RankingResponse>('/ranking/list/' + page, { query });
  }

}
